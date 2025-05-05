import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@src/prisma/prisma.service';
import { AuthUserDto } from './dto/auth-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  // auth.service.ts
  async handleGoogleCallback(
    payload: AuthUserDto & {
      googleAccessToken: string;
      googleRefreshToken: string;
    }
  ) {
    const {
      email,
      name,
      profileImageUrl,
      authProvider,
      googleAccessToken,
      googleRefreshToken,
    } = payload;

    // 1) DB에서 유저 조회
    let user = await this.prisma.user.findUnique({ where: { email } });

    // 2) 없으면 생성, 있으면 토큰만 갱신
    if (user) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          googleAccessToken,
          googleRefreshToken,
          googleTokenExpiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15일 후 만료
          lastLogin: new Date(),
        },
      });
    } else {
      user = await this.prisma.user.create({
        data: {
          email,
          name,
          profileImageUrl,
          authProvider,
          googleAccessToken,
          googleRefreshToken,
          googleTokenExpiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15일 후 만료
          lastLogin: new Date(),
        },
      });
    }

    // 3) 우리 서비스 JWT 발급 (7일짜리)
    const jwtPayload = { userId: user.id, email: user.email };
    const accessToken = this.jwtService.sign(jwtPayload, {
      expiresIn: '7d',
      secret: process.env.ACCESS_TOKEN_SECRET,
    });

    return { user, accessToken };
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

    // 액세스 토큰 생성
    const accessToken = this.generateAccessToken(user.id);
    const responseUser = this.filterUserFields(user);
    return {
      user: responseUser,
      accessToken,
    };
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
