import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBannedUserForBloggerCommand } from '../queryCommands/getBannedUserForBlogger.command';
import { BlogsRepository } from '../../public/blogs/blogs.repository';
import { ForbiddenException } from '@nestjs/common';

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
    let mappedBanUsers = [];
    let superMegaTotalCount = 0;
    const owner = await this.blogsRepository.getOwnerBlogId(ownerId, blogId);
    const users = await this.blogsRepository.getBannedUsers(
      page,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      blogId,
      ownerId,
    );
    if (!owner) throw new ForbiddenException();
    if (users.bannedUsers.length) {
      superMegaTotalCount = users.count[0].blackList;
      mappedBanUsers = users.bannedUsers.map((obj) => {
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
    }
    return {
      pagesCount: Math.ceil(superMegaTotalCount / pageSize),
      page: page,
      pageSize: pageSize,
      totalCount: superMegaTotalCount,
      items: mappedBanUsers,
    };
  }
}
