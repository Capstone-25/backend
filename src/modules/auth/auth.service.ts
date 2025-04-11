import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@src/prisma/prisma.service';
import axios from 'axios';
import { AuthUserDto } from './dto/auth-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async handleGoogleCallback(code: string) {
    try {
      // Google 토큰 요청
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_CALLBACK_DEPLOY_URL,
          grant_type: 'authorization_code',
        }
      );
      const { access_token } = tokenResponse.data;
      // Google 사용자 정보 요청
      const userInfoResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      const userData = userInfoResponse.data;

      const isExistingUser = await this.checkUserExist(userData.email);
      const user = await this.findOrCreateUser({
        email: userData.email,
        name: userData.name,
        profileImageUrl: userData.picture,
        authProvider: 'google',
      });

      const accessToken = this.generateAccessToken(user.id);
      const responseUser = this.filterUserFields(user);

      return {
        user: responseUser,
        accessToken,
        isExistingUser,
      };
    } catch (error) {
      console.error(error);
    }
  }

  // 회원가입 로직
  async signup(email: string, name: string, password: string) {
    // 이메일 중복 확인
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUserByEmail) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    // 새로운 사용자 생성
    const newUser = await this.prisma.user.create({
      data: {
        email,
        name,
        password,
        authProvider: 'default',
      },
    });

    return {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };
  }

  // 로그인 로직
  async login(email: string, password: string) {
    // 사용자 조회
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user || user.password !== password) {
      throw new HttpException(
        '유효하지 않는 이메일 혹은 비밀번호 입니다',
        HttpStatus.FORBIDDEN
      );
    }

    // 액세스 토큰 및 리프레시 토큰 생성
    const accessToken = this.generateAccessToken(user.id);
    const responseUser = this.filterUserFields(user);
    return {
      user: responseUser,
      accessToken,
    };
  }
  private async checkUserExist(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return !!user;
  }

  private filterUserFields(user: any) {
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      profileImageUrl: user.profileImageUrl,
      authProvider: user.authProvider,
    };
  }

  generateAccessToken(userId: number): string {
    console.log(`Access Token 생성: userId=${userId}`);
    return this.jwtService.sign(
      { userId },
      { expiresIn: '7d', secret: process.env.ACCESS_TOKEN_SECRET }
    );
  }

  async findOrCreateUser(profile: AuthUserDto) {
    // 이메일로 유저 찾기
    const existingUser = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });
    if (existingUser) {
      return existingUser; // 기존 유저 반환
    }
    // 최종적으로 유니크한 닉네임으로 새 유저 생성
    return this.prisma.user.create({
      data: {
        email: profile.email,
        name: profile.name,
        profileImageUrl: profile.profileImageUrl,
        authProvider: profile.authProvider,
      },
    });
  }
}
