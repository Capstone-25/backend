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
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<AuthUserDto> {
    const { id, emails, displayName, photos } = profile;

    if (!emails || emails.length === 0) {
      throw new Error('No email associated with this Google account');
    }

    return {
      email: emails[0].value,
      name: displayName,
      profileImageUrl: photos[0]?.value || null,
      authProvider: 'google',
    };
  }
}
