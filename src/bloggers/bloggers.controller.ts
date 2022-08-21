import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BloggersService } from './bloggers.service';
import { BasicGuards } from '../auth/guards/basic.guards';
import { PostsService } from '../posts/posts.service';
import { NewPost } from '../classes/classes';
import { BloggersDto } from './dto/bloggers.dto';
import { JwtExtract } from '../auth/guards/jwt.extract';

@Controller('bloggers')
export class BloggersController {
  constructor(
    private bloggersService: BloggersService,
    private postsService: PostsService,
  ) {}

  @Get('/')
  async getAllBloggers(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('searchNameTerm') searchNameTerm: string,
  ) {
    return await this.bloggersService.getBloggers(
      page,
      pageSize,
      searchNameTerm,
    );
  }

  @Get('/:id')
  async getBlogger(@Param('id') id: string) {
    return await this.bloggersService.getBloggerById(id);
  }

  @UseGuards(BasicGuards)
  @Post('/')
  async createBlogger(@Body() bloggersDto: BloggersDto) {
    return await this.bloggersService.createBlogger(bloggersDto);
  }

  @UseGuards(BasicGuards)
  @Put('/:id')
  async updateBlogger(
    @Param('id') id: string,
    @Body() bloggersDto: BloggersDto,
  ) {
    const update = { ...bloggersDto };
    return await this.bloggersService.updateBlogger(id, update);
  }

  @UseGuards(BasicGuards)
  @Delete('/:id')
  async deleteBlogger(@Param('id') id: string) {
    return await this.bloggersService.deleteBlogger(id);
  }

  @UseGuards(JwtExtract)
  @Get('/:bloggerId/posts')
  async getPostForBlogger(
    @Param('bloggerId') bloggerId: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('searchNameTerm') searchNameTerm: string,
    @Request() req,
  ) {
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
  @Post('/:bloggerId/posts')
  async createNewPostForBlogger(
    @Param('bloggerId') bloggerId: string,
    @Body() newPost: NewPost,
  ) {
    const newPostForBlogger = await this.postsService.create(
      bloggerId,
      newPost,
    );
    return newPostForBlogger;
  }
}
