import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-firebase-jwt';
import { ExtractJwt } from 'passport-jwt';
import * as firebaseAdmin from 'firebase-admin';
import { AuthService } from '../auth.service';
import AuthModuleConstants from '../utils/constants';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(
  Strategy,
  AuthModuleConstants.FirebaseAuthGuardString,
) {
  private defaultApp: firebaseAdmin.app.App;
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    this.defaultApp = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.applicationDefault(),
    });
  }

  async validate(token: string) {
    const firebaseUser = await this.defaultApp
      .auth()
      .verifyIdToken(token, true)
      .catch((err: any) => {
        // console.log(err);
        throw new UnauthorizedException(err.message);
      });

      // console.log("Firebase User:: ", firebaseUser);
    if (!firebaseUser) {
      throw new UnauthorizedException();
    }

    const user = this.authService.validateUser({
      email: firebaseUser.email!,
      name: firebaseUser.name,
    });

    return user || null;
  }
}
