import { BloggersService } from './bloggers.service';
import { PostsService } from '../posts/posts.service';
import {
  Blogger,
  NewPost,
  Paginator,
  PostsCon,
} from '../../common/types/classes/classes';
import { BloggersDto } from './dto/bloggers.dto';
import { Pagination } from '../../common/types/classes/pagination';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BasicGuards } from '../auth/guards/basic.guards';
import { JwtExtract } from '../auth/guards/jwt.extract';

@Controller('blogs')
export class BloggersController {
  constructor(
    private bloggersService: BloggersService,
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
    const blogger = await this.bloggersService.getBloggerById(id);
    if (!blogger) {
      throw new NotFoundException();
    }
    return blogger;
  }

  @UseGuards(BasicGuards)
  @Post()
  async createBlogger(@Body() bloggersDto: BloggersDto): Promise<Blogger> {
    return await this.bloggersService.createBlogger(bloggersDto);
  }

  @UseGuards(BasicGuards)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updateBlogger(
    @Param('id') id: string,
    @Body() bloggersDto: BloggersDto,
  ): Promise<boolean> {
    const blog = await this.bloggersService.getBloggerById(id);
    if (!blog) throw new NotFoundException();
    const update = { ...bloggersDto };
    return await this.bloggersService.updateBlogger(id, update);
  }

  @UseGuards(BasicGuards)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteBlogger(@Param('id') id: string): Promise<boolean> {
    const removeBlogger = await this.bloggersService.deleteBlogger(id);
    if (!removeBlogger) throw new NotFoundException();
    return removeBlogger;
  }

  @UseGuards(JwtExtract)
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
    const pages = await this.postsService.findAll(
      page,
      pageSize,
      userId,
      blogId,
      searchNameTerm,
      sortBy,
      sortDirection,
    );
    return pages;
  }

  @UseGuards(BasicGuards)
  @Post(':blogId/posts')
  async createNewPostForBlogger(
    @Param('blogId') blogId: string,
    @Body() newPost: NewPost,
  ): Promise<PostsCon> {
    const blogger = await this.bloggersService.getBloggerById(blogId);
    if (!blogger) throw new NotFoundException();
    const newPostForBlogger = await this.postsService.create(
      {
        ...newPost,
        blogId,
      },
      blogger.name,
    );
    return newPostForBlogger;
  }
}
