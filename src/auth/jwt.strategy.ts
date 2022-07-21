import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConstants } from './constants';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('X-Amzn-Oidc-Data'),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async valdiate(payload: any) {
    return { ext: payload.ext };
  }
}
