import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { BasicGuards } from '../auth/guards/basic.guards';
import { Pagination } from '../../common/types/classes/pagination';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(BasicGuards)
  @Get()
  async getAll(@Query() query) {
    const {
      page,
      pageSize,
      searchLoginTerm,
      searchEmailTerm,
      sortBy,
      sortDirection,
    } = Pagination.getPaginationDataForUser(query);
    return await this.usersService.getAllUsers(
      page,
      pageSize,
      searchLoginTerm,
      searchEmailTerm,
      sortBy,
      sortDirection,
    );
  }
  @SkipThrottle()
  @UseGuards(BasicGuards)
  @Post()
  async create(@Body() createUser: CreateUserDto) {
    console.log(createUser, 'user created');
    const user = await this.usersService.createUser(createUser);
    return {
      id: user.accountData.id,
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt,
      banInfo: {
        banDate: user.banInfo.banDate,
        banReason: user.banInfo.banReason,
        isBanned: user.banInfo.isBanned,
      },
    };
  }
  @UseGuards(BasicGuards)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    const user = await this.usersService.findUserById(id);
    if (!user)
      throw new HttpException(
        { message: [{ message: 'invalid value', field: 'deviceId' }] },
        HttpStatus.NOT_FOUND,
      );
    return await this.usersService.deleteUser(id);
  }
}
