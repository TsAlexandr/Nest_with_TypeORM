import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtExtract } from '../auth/guards/jwt.extract';
import { AuthGuard } from '../auth/guards/auth.guard';
import { JwtAuthGuards } from '../auth/guards/jwt-auth.guards';
import { CommentBelongsGuard } from '../auth/guards/commentBelongsGuard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @UseGuards(JwtExtract)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const userId = req.user.userId || null;
    return await this.commentsService.findOne(id, userId);
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
  @UseGuards(JwtAuthGuards)
  @UseGuards(CommentBelongsGuard)
  @Put(':commentId/like-status')
  async updateActions(
    @Param('commentId') id: string,
    @Req() req,
    @Body('likeStatus') status: string,
  ) {
    const user = req.user;
    const update = await this.commentsService.updateActions(id, status, user);
    return update;
  }
}
