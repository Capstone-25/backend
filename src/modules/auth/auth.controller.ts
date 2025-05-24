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
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ApiTags } from '@nestjs/swagger';
import { AuthSwagger } from './swagger/auth.swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @AuthSwagger.googleLogin.operation
  async googleLogin() {
    //구글 로그인 요청
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @AuthSwagger.googleCallback.operation
  @AuthSwagger.googleCallback.response
  async googleCallback(@Req() req, @Res() res: Response) {
    console.log('구글 콜백 라우트 진입');
    const { accessToken } = await this.authService.handleGoogleCallback(
      req.user
    );
    // 프론트엔드로 리디렉션하며 accessToken을 쿼리스트링으로 전달
    return res.redirect(
      //`http://localhost:5173/#/auth/google/callback?accessToken=${accessToken}`
      `https://sehxxnee.github.io/#/auth/google/callback?accessToken=${accessToken}`
    );
  }

  @Post('signup')
  @AuthSwagger.signup.operation
  @AuthSwagger.signup.body
  @AuthSwagger.signup.response
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
  @AuthSwagger.login.operation
  @AuthSwagger.login.body
  @AuthSwagger.login.response
  async login(@Body() body: { email: string; password: string }) {
    const result = await this.authService.login(body.email, body.password);
    return {
      message: '일반 로그인 성공',
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post('refresh')
  @AuthSwagger.refresh.operation
  @AuthSwagger.refresh.response
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['refresh_token'];
    const payload = this.jwtService.verify(token, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (
      !user?.currentHashedRefreshToken ||
      !(await bcrypt.compare(token, user.currentHashedRefreshToken))
    ) {
      throw new UnauthorizedException();
    }
    const newAccessToken = this.jwtService.sign(
      { userId: user.id, email: user.email },
      { expiresIn: '1h' }
    );
    return res.send({ accessToken: newAccessToken });
  }
}
