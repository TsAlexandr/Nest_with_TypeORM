import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';

@Injectable()
export class UserExistGuard implements CanActivate {
  constructor(private userService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> | null {
    const request: Request = context.switchToHttp().getRequest();
    const id = request.params.userId;
    const comment = await this.userService.findUserById(id);
    if (!comment)
      throw new NotFoundException({
        message: 'user not found',
        field: 'userId',
      });
    return true;
  }
}
