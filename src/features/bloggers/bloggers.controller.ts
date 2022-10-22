import { BloggersService } from './bloggers.service';
import { PostsService } from '../posts/posts.service';
import { NewPost } from '../../common/types/classes/classes';
import { BloggersDto } from './dto/bloggers.dto';
import { Pagination } from '../../common/types/classes/pagination';
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
import { BasicGuards } from '../auth/guards/basic.guards';
import { JwtExtract } from '../auth/guards/jwt.extract';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('blogs')
export class BloggersController {
  constructor(
    private bloggersService: BloggersService,
    private postsService: PostsService,
  ) {}

  @Get()
  async getAllBloggers(@Query() query) {
    const { page, pageSize, searchNameTerm } =
      Pagination.getPaginationData(query);
    const bloggers = await this.bloggersService.getBloggers(
      page,
      pageSize,
      searchNameTerm,
    );
    if (!bloggers) {
      throw new NotFoundException();
    }
    return bloggers;
  }

  @Get(':id')
  async getBlogger(@Param('id') id: string) {
    const blogger = await this.bloggersService.getBloggerById(id);
    if (!blogger) {
      throw new NotFoundException();
    }
    return blogger;
  }

  @UseGuards(BasicGuards)
  @Post()
  async createBlogger(@Body() bloggersDto: BloggersDto) {
    return await this.bloggersService.createBlogger(bloggersDto);
  }

  @UseGuards(BasicGuards)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updateBlogger(
    @Param('id') id: string,
    @Body() bloggersDto: BloggersDto,
  ) {
    const update = { ...bloggersDto };
    return await this.bloggersService.updateBlogger(id, update);
  }

  @UseGuards(BasicGuards)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteBlogger(@Param('id') id: string) {
    const removeBlogger = await this.bloggersService.deleteBlogger(id);
    if (!removeBlogger) {
      throw new NotFoundException();
    }
    return removeBlogger;
  }

  @UseGuards(JwtExtract)
  @Get(':bloggerId/posts')
  async getPostForBlogger(
    @Param('bloggerId') bloggerId: string,
    @Query() query,
    @Req() req,
  ) {
    const { page, pageSize, searchNameTerm } =
      Pagination.getPaginationData(query);
    const userId = req.user.userId || null;
    const pages = await this.postsService.findAll(
      page,
      pageSize,
      userId,
      bloggerId,
      searchNameTerm,
    );
    return pages;
  }

  @UseGuards(BasicGuards)
  @Post(':bloggerId/posts')
  async createNewPostForBlogger(
    @Param('bloggerId') bloggerId: string,
    @Body() newPost: NewPost,
  ) {
    const blogger = await this.bloggersService.getBloggerById(bloggerId);
    const bloggerName = blogger.name;
    const newPostForBlogger = await this.postsService.create({
      ...newPost,
      bloggerId,
      bloggerName,
    });
    return newPostForBlogger;
  }
}
