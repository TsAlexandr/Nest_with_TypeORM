import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UsersRepository } from '../../users/users.repository';

@Injectable()
export class BearerAuthGuard implements CanActivate {
  constructor(private usersRepository: UsersRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req.headers.authorization) {
      throw new UnauthorizedException();
    }
    const token = req.headers.authorization.split(' ')[1];
    const decode: any = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decode) {
      throw new UnauthorizedException();
    }

    req.user = await this.usersRepository.findById(decode.userId);
    return true;
  }
}
