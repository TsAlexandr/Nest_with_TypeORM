import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAll(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.usersService.getAllUsers(page, pageSize);
  }

  @Post()
  async create(
    @Body('login') login: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.usersService.createUser(login, email, password);
    return {
      id: user.accountData.id,
      login: user.accountData.login,
    };
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }
}
