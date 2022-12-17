import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BanUserForBlogCommand } from '../commands/banUserForBlog.command';
import { UsersRepository } from '../../sa/users/users.repository';
import { NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../../public/blogs/blogs.repository';
@CommandHandler(BanUserForBlogCommand)
export class BanUserForBlogHandler
  implements ICommandHandler<BanUserForBlogCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private blogsRepository: BlogsRepository,
  ) {}
  async execute(command: BanUserForBlogCommand) {
    const { id, banBlogDto } = command;
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException();
    await this.blogsRepository.banUserForBlog(banBlogDto, user.id, user.login);
    return true;
  }
}
