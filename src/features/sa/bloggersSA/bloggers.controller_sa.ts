import { Blogger, Paginator } from '../../../common/types/classes/classes';
import { Pagination } from '../../../common/types/classes/pagination';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from '../../public/blogs/blogs.service';
import { BasicGuards } from '../../public/auth/guards/basic.guards';
import { BloggersMongo } from '../../../common/types/schemas/schemas.model';

@UseGuards(BasicGuards)
@Controller('sa/blogs')
export class SuperBlogsController {
  constructor(private bloggersService: BlogsService) {}

  @Get()
  async getAllBloggers(@Query() query): Promise<Paginator<BloggersMongo[]>> {
    const { page, pageSize, searchNameTerm, sortBy, sortDirection } =
      Pagination.getPaginationData(query);
    const bloggers = await this.bloggersService.getBlogsWithOwner(
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

  @Put(':id/bind-with-user/:userId')
  async bindBlogWithUser(
    @Param('id') blogId: string,
    @Param('userId') userId: string,
  ) {
    return this.bloggersService.bindWithUser(blogId, userId);
  }
}
