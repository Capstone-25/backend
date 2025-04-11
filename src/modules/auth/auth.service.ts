import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@src/prisma/prisma.service';
import axios from 'axios';
import { AuthUserDto } from './dto/auth-user.dto';
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

  private async checkUserExist(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return !!user;
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
