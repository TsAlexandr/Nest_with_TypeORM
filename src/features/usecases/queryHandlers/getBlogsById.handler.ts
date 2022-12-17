import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBlogsByIdCommand } from '../queryCommands/getBlogsById.command';
import { BlogsRepository } from '../../public/blogs/blogs.repository';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetBlogsByIdCommand)
export class GetBlogsByIdHandler implements IQueryHandler<GetBlogsByIdCommand> {
  constructor(private blogsRepository: BlogsRepository) {}
  async execute(query: GetBlogsByIdCommand) {
    const { id } = query;
    const blog = await this.blogsRepository.getBlogsById(id);
    if (!blog?.banInfo.isBanned === true) throw new NotFoundException();
    return blog;
  }
}
