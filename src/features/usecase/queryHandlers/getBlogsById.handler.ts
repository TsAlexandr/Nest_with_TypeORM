import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBlogsByIdCommand } from '../queryCommands/getBlogsById.command';
import { BlogsRepository } from '../../public/blogs/blogs.repository';

@QueryHandler(GetBlogsByIdCommand)
export class GetBlogsByIdHandler implements IQueryHandler<GetBlogsByIdCommand> {
  constructor(private blogsRepository: BlogsRepository) {}
  async execute(query: GetBlogsByIdCommand) {
    const { id } = query;
    return this.blogsRepository.getBlogsById(id);
  }
}
