import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtExtract } from '../auth/guards/jwt.extract';
import { AuthGuard } from '../auth/guards/auth.guard';
import { JwtAuthGuards } from '../auth/guards/jwt-auth.guards';
import { CommentBelongsGuard } from '../auth/guards/commentBelongsGuard';
import { UsersService } from '../users/users.service';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private usersService: UsersService,
  ) {}

  @UseGuards(JwtExtract)
  @Get(':id')
  async findComment(@Param('id') id: string, @Req() req) {
    const userId = req.user.userId || null;
    return await this.commentsService.findComment(id, userId);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateComment(@Param('id') id: string, @Body() content: string) {
    return await this.commentsService.updateComment(id, content);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteComment(@Param('id') id: string) {
    return await this.commentsService.deleteComment(id);
  }

  @HttpCode(204)
  @UseGuards(JwtAuthGuards)
  @UseGuards(CommentBelongsGuard)
  @Put(':commentId/like-status')
  async updateActions(
    @Param('commentId') commentId: string,
    @Body('likeStatus') status: string,
    @Req() req,
  ) {
    if (status === '') {
      throw new HttpException(
        { message: [{ message: 'invalid value', field: 'likeStatus' }] },
        HttpStatus.BAD_REQUEST,
      );
    }
    const userId = req.user.payload.sub;
    const user = await this.usersService.findUserById(userId);
    return await this.commentsService.updateLikes(
      commentId,
      status,
      userId,
      user.accountData.login,
    );
  }
}
