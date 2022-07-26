import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BloggersService } from './bloggers.service';
import { BloggersDto } from './dto/bloggers.dto';

@Controller('bloggers')
export class BloggersController {
  constructor(private bloggersService: BloggersService) {}
  @Get()
  getAllBloggers(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('searchNameTerm') searchNameTerm: string,
  ) {
    return this.bloggersService.getBloggers(page, pageSize, searchNameTerm);
  }
  @Get(':id')
  getBlogger(@Param('id') id: string) {
    return this.bloggersService.getBloggerById(id);
  }

  @Post()
  createBlogger(@Body() name: string, @Body() youtubeUrl: string) {
    return this.bloggersService.createBlogger(name, youtubeUrl);
  }
  @HttpCode(204)
  @Put(':id')
  updateBlogger(
    @Param('id') id: string,
    @Body() name: string,
    @Body() youtubeUrl: string,
  ) {
    return this.bloggersService.updateBlogger(id, name, youtubeUrl);
  }
  @HttpCode(204)
  @Delete(':id')
  deleteBlogger(@Param('id') id: string) {
    return this.bloggersService.deleteBlogger(id);
  }
}
