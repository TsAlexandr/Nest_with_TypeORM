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
    if (!users.bannedUsers.length) throw new NotFoundException();
    const mappedBanUsers = users.bannedUsers.map((obj) => {
      return {
        id: obj.blackList.id,
        login: obj.blackList.login,
        banInfo: {
          isBanned: obj.blackList.isBanned,
          banDate: obj.blackList.banDate,
          banReason: obj.blackList.banReason,
        },
      };
    });
    return {
      pagesCount: Math.ceil(users.count[0].blackList / pageSize),
      page: page,
      pageSize: pageSize,
      totalCount: users.count[0].blackList,
      items: mappedBanUsers,
    };
  }
}
