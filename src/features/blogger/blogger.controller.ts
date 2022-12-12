import {
  Body,
  Controller,
  Delete,
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
import { Request } from 'express';
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
    @Req() req: Request,
  ): Promise<Blogger> {
    //TODO solve this problem
    // @ts-ignore
    const userId = req.user.payload.userId;
    console.log(userId);
    const user = await this.usersService.findUserById(userId);
    return this.bloggersService.createBlogger(bloggersDto, user.id, user.login);
  }

  @Post(':blogId/posts')
  async createNewPostForBlogger(
    @Param('blogId') blogId: string,
    @Body() newPost: NewPost,
  ): Promise<PostsCon> {
    const blogger = await this.bloggersService.getBloggerById(blogId);
    if (!blogger) throw new NotFoundException();
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
  ): Promise<boolean> {
    const blog = await this.bloggersService.getBloggerById(id);
    if (!blog) throw new NotFoundException();
    return this.bloggersService.updateBlogger(id, { ...bloggersDto });
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':blogId/posts/:postId')
  async updatePostById(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() posts: NewPost,
  ) {
    const blog = await this.bloggersService.getBloggerById(blogId);
    if (!blog) throw new NotFoundException();
    return this.postsService.update({ postId, ...posts });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteBlogger(@Param('id') id: string): Promise<boolean> {
    const removeBlogger = await this.bloggersService.deleteBlogger(id);
    if (!removeBlogger) throw new NotFoundException();
    return removeBlogger;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':blogId/posts/:postId')
  async deletePostForExistingBlogger(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
  ): Promise<boolean> {
    const blogger = await this.bloggersService.getBloggerById(blogId);
    if (!blogger) throw new NotFoundException();
    return this.postsService.remove(postId);
  }
}
