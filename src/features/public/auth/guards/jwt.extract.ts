import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtExtract implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      return true;
    }
    try {
      const secret = this.configService.get('JWT_SECRET_KEY');
      const user: any = jwt.verify(request.headers.authorization[1], secret);
      if (user) {
        request.user = { userId: user.userId, userLogin: user.login };
      }
      return true;
    } catch {
      return true;
    }
  }
}
