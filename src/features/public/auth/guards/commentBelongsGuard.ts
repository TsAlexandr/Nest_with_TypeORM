import { CommentsService } from '../../comments/comments.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CommentBelongsGuard implements CanActivate {
  constructor(private commentsService: CommentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> | null {
    const request: Request = context.switchToHttp().getRequest();
    const commentId = request.params.commentId;
    const comment = await this.commentsService.findComment(commentId);
    if (!comment)
      throw new NotFoundException({
        message: 'comment not found',
        field: 'commentId',
      });
    return true;
  }
}
