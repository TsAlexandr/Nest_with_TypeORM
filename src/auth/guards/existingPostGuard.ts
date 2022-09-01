import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { PostsService } from '../../posts/posts.service';

@Injectable()
export class ExistingPostGuard implements CanActivate {
  constructor(private postsService: PostsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> | null {
    const request: Request = context.switchToHttp().getRequest();
    const id = request.params.postId;
    const post = await this.postsService.findOne(id, null);
    if (!post)
      throw new NotFoundException({
        message: 'post not found',
        field: 'postId',
      });
    return true;
  }
}
