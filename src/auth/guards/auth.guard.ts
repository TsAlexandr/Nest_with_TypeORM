import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../../constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req.headers || !req.headers.authorization) {
      throw new BadRequestException({ message: 'Where is your header?' });
    }
    const version = req.headers.authorization.split(' ')[0];
    const token = req.headers.authorization.split(' ')[1];
    if (version !== 'Bearer') {
      throw new BadRequestException({ message: 'Invalid pass or login' });
    }
    try {
      const decode: any = this.jwtService.verify(token, jwtConstants);
      const user = await this.usersRepository.findById(decode.userId);
      if (!user) {
        throw new NotFoundException({
          field: 'token',
          message: 'not found',
        });
      }
    } catch (e) {
      throw new UnauthorizedException({
        message: 'invalid log or pass',
      });
    }
    return true;
  }
}
