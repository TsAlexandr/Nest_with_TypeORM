import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuards } from '../public/auth/guards/jwt-auth.guards';
import { BanBlogDto } from './dto/banBlog.dto';
import { Pagination } from '../../common/types/classes/pagination';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetBannedUserForBloggerCommand } from '../usecases/queryCommands/getBannedUserForBlogger.command';
import { BanUserForBlogCommand } from '../usecases/commands/banUserForBlog.command';
import { CurrentUserId } from '../../common/custom-decorator/current.user.decorator';

@UseGuards(JwtAuthGuards)
@Controller('/blogger/users')
export class BloggerUsersController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

  @Get('blog/:id')
  async getAllBannedUsers(
    @Query() query,
    @Param('id') id: string,
    @CurrentUserId() ownerId: string,
  ) {
    const { page, pageSize, sortBy, sortDirection, searchLoginTerm } =
      Pagination.getPaginationDataForUser(query);
    return this.queryBus.execute(
      new GetBannedUserForBloggerCommand(
        page,
        pageSize,
        sortBy,
        sortDirection,
        searchLoginTerm,
        id,
        ownerId,
      ),
    );
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id/ban')
  async banUserForBlog(
    @Param('id') id: string,
    @Body() banBlogDto: BanBlogDto,
    @CurrentUserId() userId: string,
  ) {
    return this.commandBus.execute(
      new BanUserForBlogCommand(id, banBlogDto, userId),
    );
  }
}
