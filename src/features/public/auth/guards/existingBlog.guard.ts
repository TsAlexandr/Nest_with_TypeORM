import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { BlogsService } from '../../blogs/blogs.service';

@Injectable()
export class ExistingBlogGuard implements CanActivate {
  constructor(private blogsService: BlogsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> | null {
    const request: Request = context.switchToHttp().getRequest();
    const id = request.params.id;
    const blog = await this.blogsService.getBloggerById(id);
    if (!blog)
      throw new NotFoundException({
        message: 'blog not found',
        field: 'blogId',
      });
    return true;
  }
}
