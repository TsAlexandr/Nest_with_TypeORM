import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllBloggerCommentsCommand } from '../queryCommands/getAllBloggerComments.command';
import { BlogsRepository } from '../../public/blogs/blogs.repository';

@QueryHandler(GetAllBloggerCommentsCommand)
export class GetAllBloggerCommentsHandler
  implements IQueryHandler<GetAllBloggerCommentsCommand>
{
  constructor(private blogsRepository: BlogsRepository) {}
  async execute(query: GetAllBloggerCommentsCommand) {
    const { page, pageSize, sortBy, sortDirection, ownerId } = query;
    //const currentBlog = await this.blogsRepository.getBlogsWithOwnerId(ownerId);
  }
}
