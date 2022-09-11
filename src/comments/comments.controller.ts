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
  Res,
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
  @Get(':commentId')
  async findOne(@Param('commentId') commentId: string, @Req() req) {
    const userId = req.user.userId || null;
    return await this.commentsService.findOne(commentId, userId);
  }
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() content: string) {
    return await this.commentsService.update(id, content);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.commentsService.remove(id);
  }
  @HttpCode(204)
  @UseGuards(JwtAuthGuards)
  @UseGuards(CommentBelongsGuard)
  @Put(':commentId/like-status')
  async updateActions(
    @Param('commentId') commentId: string,
    @Req() req,
    @Body('likeStatus') status: string,
    @Res() res,
  ) {
    if (status !== 'Like' && status !== 'Dislike' && status !== 'None') {
      res.status(400).send({
        errorsMessages: [{ message: 'its bad ', field: 'likeStatus' }],
      });
    }
    const userId = req.user.payload.sub;
    const user = await this.usersService.findUserById(userId);
    const update = await this.commentsService.updateActions(
      commentId,
      status,
      userId,
      user.accountData.login,
    );
    return null;
  }
}
