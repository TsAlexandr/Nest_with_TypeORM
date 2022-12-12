import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuards } from '../public/auth/guards/jwt-auth.guards';
import {
  Blogger,
  NewPost,
  Paginator,
  PostsCon,
} from '../../common/types/classes/classes';
import { BloggersDto } from '../public/blogs/dto/bloggers.dto';
import { BlogsService } from '../public/blogs/blogs.service';
import { PostsService } from '../public/posts/posts.service';
import { Pagination } from '../../common/types/classes/pagination';
import { UsersService } from '../sa/users/users.service';

@UseGuards(JwtAuthGuards)
@Controller('blogger/blogs')
export class BloggerController {
  constructor(
    private bloggersService: BlogsService,
    private postsService: PostsService,
    private usersService: UsersService,
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

  @Post()
  async createBlogger(
    @Body() bloggersDto: BloggersDto,
    @Req() req,
  ): Promise<Blogger> {
    const userId = req.user.payload.userId;
    const user = await this.usersService.findUserById(userId);
    return this.bloggersService.createBlogger(bloggersDto, user.id, user.login);
  }

  @Post(':blogId/posts')
  async createNewPostForBlogger(
    @Param('blogId') blogId: string,
    @Body() newPost: NewPost,
    @Req() req,
  ): Promise<PostsCon> {
    const blogger = await this.bloggersService.getBloggerById(blogId);
    if (!blogger) throw new NotFoundException();
    const userId = req.user.payload.userId;
    if (blogger.blogOwnerInfo.userId !== userId) throw new ForbiddenException();
    return this.postsService.create(
      {
        ...newPost,
        blogId,
      },
      blogger.name,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updateBlogger(
    @Param('id') id: string,
    @Body() bloggersDto: BloggersDto,
    @Req() req,
  ): Promise<boolean> {
    const blog = await this.bloggersService.getBloggerById(id);
    if (!blog) throw new NotFoundException();
    const userId = req.user.payload.userId;
    if (blog.blogOwnerInfo.userId !== userId) throw new ForbiddenException();
    return this.bloggersService.updateBlogger(id, { ...bloggersDto });
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':blogId/posts/:postId')
  async updatePostById(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() posts: NewPost,
    @Req() req,
  ) {
    const blog = await this.bloggersService.getBloggerById(blogId);
    if (!blog) throw new NotFoundException();
    const post = await this.postsService.findOne(postId, null);
    if (!post) throw new NotFoundException();
    const userId = req.user.payload.userId;
    if (blog.blogOwnerInfo.userId !== userId) throw new ForbiddenException();
    return this.postsService.update({ postId, ...posts });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteBlogger(@Param('id') id: string, @Req() req): Promise<boolean> {
    const blogger = await this.bloggersService.getBloggerById(id);
    if (!blogger) throw new NotFoundException();
    const userId = req.user.payload.userId;
    if (blogger.blogOwnerInfo.userId !== userId) throw new ForbiddenException();
    const removeBlogger = await this.bloggersService.deleteBlogger(id);
    if (!removeBlogger) throw new NotFoundException();
    return removeBlogger;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':blogId/posts/:postId')
  async deletePostForExistingBlogger(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Req() req,
  ): Promise<boolean> {
    const blogger = await this.bloggersService.getBloggerById(blogId);
    if (!blogger) throw new NotFoundException();
    const userId = req.user.payload.userId;
    if (blogger.blogOwnerInfo.userId !== userId) throw new ForbiddenException();
    const post = await this.postsService.findOne(postId, null);
    if (!post) throw new NotFoundException();
    return this.postsService.remove(postId);
  }
}
