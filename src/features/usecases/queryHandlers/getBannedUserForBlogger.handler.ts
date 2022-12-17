import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBannedUserForBloggerCommand } from '../queryCommands/getBannedUserForBlogger.command';
import { BlogsRepository } from '../../public/blogs/blogs.repository';
import { NotFoundException } from '@nestjs/common';

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
      blogId,
      ownerId,
    } = query;
    const users = await this.blogsRepository.getBannedUsers(
      page,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      blogId,
      ownerId,
    );
    const mappedBanUsers = users.bannedUsers.blackList.map((obj) => {
      return {
        id: obj.id,
        login: obj.login,
        banInfo: {
          isBanned: obj.isBanned,
          banDate: obj.banDate,
          banReason: obj.banReason,
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
