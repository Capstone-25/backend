import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthUserDto } from '../dto/auth-user.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    const options = {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: [
        'openid', // OIDC 필수
        'email',
        'profile',
        'https://www.googleapis.com/auth/calendar',
      ],
    };
    super(options);
  }

  authorizationParams(): { [key: string]: string } {
    return {
      access_type: 'offline',
      prompt: 'consent',
    };
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
    done(null, {
      ...userDto,
      googleAccessToken: accessToken,
      googleRefreshToken: refreshToken,
    });
  }
}
