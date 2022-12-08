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

@UseGuards(BasicGuards)
@Controller('sa/blogs')
export class SuperBlogsController {
  constructor(private bloggersService: BlogsService) {}

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

  @Put(':id/bind-with-user/:userId')
  async bindBlogWithUser(
    @Param('id') blogId: string,
    @Param('userId') userId: string,
  ) {
    return;
  }
}
