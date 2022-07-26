import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { NewPost } from '../classes/classes';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() bloggerId: string, newPost: NewPost) {
    return await this.postsService.create(bloggerId, newPost);
  }

  @Get()
  async getAll(@Query() page: number, @Query() pageSize: number) {
    return await this.postsService.findAll(page, pageSize);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.postsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updPost: NewPost,
    @Body() bloggerId: string,
  ) {
    return await this.postsService.update(id, bloggerId, updPost);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.postsService.remove(id);
  }
}
