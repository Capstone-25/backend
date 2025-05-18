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
      callbackURL: 'http://localhost:8080/auth/google/callback',
      scope: ['email', 'profile', 'https://www.googleapis.com/auth/calendar'],
      accessType: 'offline', // refresh token 발급 받기 위해필수
      prompt: 'consent',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string | undefined,
    profile: any,
    done: VerifyCallback
  ) {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    const { emails, displayName, photos } = profile;
    const userDto: AuthUserDto = {
      email: emails[0].value,
      name: displayName,
      profileImageUrl: photos[0]?.value,
      authProvider: 'google',
    };
    // accessToken, refreshToken 모두 넘김
    done(null, {
      ...userDto,
      googleAccessToken: accessToken,
      googleRefreshToken: refreshToken,
    });
  }
}
