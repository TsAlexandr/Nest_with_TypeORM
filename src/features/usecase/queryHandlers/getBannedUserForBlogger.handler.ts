import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBannedUserForBloggerCommand } from '../queryCommands/getBannedUserForBlogger.command';
import { BlogsRepository } from '../../public/blogs/blogs.repository';

@QueryHandler(GetBannedUserForBloggerCommand)
export class GetBannedUserForBloggerHandler
  implements IQueryHandler<GetBannedUserForBloggerCommand>
{
  constructor(private blogsRepository: BlogsRepository) {}
  async execute(query: GetBannedUserForBloggerCommand) {
    const {
      page,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      id,
      ownerId,
    } = query;
    const users = await this.blogsRepository.getBannedUsers(
      page,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      id,
      ownerId,
    );
    const mappedBanUsers = users.bannedUsers.map((obj) => {
      return {
        id: obj.banInfo.id,
        login: obj.banInfo.login,
        banInfo: {
          isBanned: obj.banInfo.isBanned,
          banDate: obj.banInfo.banDate,
          banReason: obj.banInfo.banReason,
        },
      };
    });
    return {
      pagesCount: Math.ceil(users.count / pageSize),
      page: page,
      pageSize: pageSize,
      totalCount: users.count,
      items: mappedBanUsers,
    };
  }
}