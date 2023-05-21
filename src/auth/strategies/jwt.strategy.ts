import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DecodedAccessToken } from '../entities/misc';
import EnvVars from 'src/constants/EnvVars';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: EnvVars.AccessSecret,
    });
  }

  validate(payload: DecodedAccessToken) {
    return {
      userId: payload.userId,
    };
  }
}
