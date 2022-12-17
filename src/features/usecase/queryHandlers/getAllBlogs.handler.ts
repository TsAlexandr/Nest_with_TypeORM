import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllBlogsCommand } from '../queryCommands/getAllBlogs.command';
import { BlogsRepository } from '../../public/blogs/blogs.repository';

@QueryHandler(GetAllBlogsCommand)
export class GetAllBlogsHandler implements IQueryHandler<GetAllBlogsCommand> {
  constructor(private blogsRepository: BlogsRepository) {}
  async execute(query: GetAllBlogsCommand) {
    const { page, pageSize, searchNameTerm, sortDirection, sortBy } = query;
    return this.blogsRepository.getBloggers(
      page,
      pageSize,
      searchNameTerm,
      sortBy,
      sortDirection,
    );
  }
}
