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
  getAll(@Query('page') page: number, @Query('pageSize') pageSize: number) {
    return this.usersService.getAllUsers(page, pageSize);
  }

  @Post()
  create(
    @Body('login') login: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.usersService.createUser(login, email, password);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
