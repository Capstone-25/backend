import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthUserDto } from '../dto/auth-user.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_DEPLOY_URL,
      scope: ['email', 'profile', 'https://www.googleapis.com/auth/calendar'],
      accessType: 'offline', // refresh token 발급 받기 위해필수
      prompt: 'consent',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ) {
    const { emails, displayName, photos } = profile;
    const userDto: AuthUserDto = {
      email: emails[0].value,
      name: displayName,
      profileImageUrl: photos[0]?.value,
      authProvider: 'google',
    };
    // PassportContext에 토큰까지 붙여서 넘겨줍니다.
    done(null, {
      ...userDto,
      googleAccessToken: accessToken,
      googleRefreshToken: refreshToken,
      // (옵션) 만료시간 계산 후 전달
    });
  }
}
