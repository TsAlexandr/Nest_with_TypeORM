import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtExtractStrategy extends PassportStrategy(Strategy, 'payload') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }
  async validate(payload: any) {
    const userId = payload.userId;
    const login = payload.login;
    if (!payload) return null;
    return { userId, login };
  }
}
