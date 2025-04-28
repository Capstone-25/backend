import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { JwtAuthGuard } from '@src/modules/auth/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    //구글 로그인 요청
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
    // req.user에 strategy.validate()에서 넘긴 payload가 들어있음
    const { user, accessToken, refreshToken } =
      await this.authService.handleGoogleCallback(req.user);

    // 리프레시 토큰은 HTTP-only 쿠키로 설정
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    // 클라이언트에 액세스 토큰과 유저 정보 반환
    return res.send({ message: '로그인 성공', user, accessToken });
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const userId = req.user.userId;
    // 1) DB에서 리프레시 토큰 등 제거
    await this.authService.logout(userId);
    // 2) HTTP-only 쿠키 삭제
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return { message: '로그아웃 성공' };
  }

  @Post('signup')
  async signup(
    @Body() body: { email: string; name: string; password: string }
  ) {
    const result = await this.authService.signup(
      body.email,
      body.name,
      body.password
    );
    return {
      message: '일반 회원가입 성공',
      data: result,
    };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const result = await this.authService.login(body.email, body.password);
    return {
      message: '일반 로그인 성공',
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  // Optional: 내부 JWT 재발급 엔드포인트
  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['refresh_token'];
    const payload = this.jwtService.verify(token, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });
    // 해시 검증…
    if (
      !user?.currentHashedRefreshToken ||
      !(await bcrypt.compare(token, user.currentHashedRefreshToken))
    ) {
      throw new UnauthorizedException();
    }
    // 새로운 액세스 토큰 발급
    const newAccessToken = this.jwtService.sign(
      { userId: user.id, email: user.email },
      { expiresIn: '1h' }
    );
    return res.send({ accessToken: newAccessToken });
  }
}
