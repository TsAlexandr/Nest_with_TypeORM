import { BlogsService } from './blogs.service';
import { PostsService } from '../posts/posts.service';
import {
  Blogger,
  Paginator,
  PostsCon,
} from '../../../common/types/classes/classes';
import { Pagination } from '../../../common/types/classes/pagination';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
} from '@nestjs/common';

@Controller('blogs')
export class BlogsController {
  constructor(
    private bloggersService: BlogsService,
    private postsService: PostsService,
  ) {}

  @Get()
  async getAllBloggers(@Query() query): Promise<Paginator<Blogger[]>> {
    const { page, pageSize, searchNameTerm, sortBy, sortDirection } =
      Pagination.getPaginationData(query);
    const bloggers = await this.bloggersService.getBloggers(
      page,
      pageSize,
      searchNameTerm,
      sortBy,
      sortDirection,
    );
    if (!bloggers) {
      throw new NotFoundException();
    }
    return bloggers;
  }

  @Get(':id')
  async getBlogger(@Param('id') id: string): Promise<Blogger> {
    const blogger = await this.bloggersService.getBlogsById(id);
    if (!blogger) {
      throw new NotFoundException();
    }
    return blogger;
  }

  @Get(':blogId/posts')
  async getPostForBlogger(
    @Param('blogId') blogId: string,
    @Query() query,
    @Req() req,
  ): Promise<Paginator<PostsCon[]>> {
    const { page, pageSize, searchNameTerm, sortBy, sortDirection } =
      Pagination.getPaginationData(query);
    const userId = req.user.userId || null;
    const blogger = await this.bloggersService.getBloggerById(blogId);
    if (!blogger) throw new NotFoundException();
    return this.postsService.findAll(
      page,
      pageSize,
      userId,
      blogId,
      searchNameTerm,
      sortBy,
      sortDirection,
    );
  }
}
