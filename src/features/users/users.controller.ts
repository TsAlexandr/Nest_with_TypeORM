import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SkipThrottle } from '@nestjs/throttler';

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
  async create(@Body() createUser: CreateUserDto) {
    console.log(createUser, 'user created');
    const user = await this.usersService.createUser(createUser);
    return {
      id: user.accountData.id,
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt,
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }
}
