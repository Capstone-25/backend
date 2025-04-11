import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { JwtAuthGuard } from '@src/modules/auth/guards/jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    //구글 로그인 요청
  }

  @Post('google/callback')
  async googleCallback(@Body('code') code: string, @Res() res: Response) {
    const { user, accessToken, isExistingUser } =
      await this.authService.handleGoogleCallback(code);
    return {
      message: '구글 소셜 로그인 성공',
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
        authProvider: user.authProvide,
        accessToken: accessToken,
        isExistingUser,
      },
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any, @Res() res: Response) {
    const userId = req.user?.userId;
    await this.authService.deleteRefreshToken(userId);
    return {
      message: '로그아웃 성공',
    };
  }
    
    @Post('signup')
    async signup(@Body() body: { email: string, name: string, password: string }) {
        const result = await this.authService.signup(
            body.email,
            body.name,
            body.password
        );
        return {
            message: '일반 회원가입 성공',
            data:result
        }
    }
}
