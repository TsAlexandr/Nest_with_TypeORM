import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCommentByIdCommand } from '../commands/getCommentById.commmand';
import { CommentsRepository } from '../../public/comments/comments.repository';
import { NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../../sa/users/users.repository';

@QueryHandler(GetCommentByIdCommand)
export class GetCommentByIdHandler
  implements IQueryHandler<GetCommentByIdCommand>
{
  constructor(
    private commentsRepository: CommentsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: GetCommentByIdCommand) {
    const { id, userId } = command;
    const comment = await this.commentsRepository.findComment(id);
    const allUsers = await this.usersRepository.getAllUsers();
    console.log(allUsers);
    const user = await this.usersRepository.findById(userId.toString());
    console.log(userId);
    if (!comment || user.banInfo.isBanned === true) {
      throw new NotFoundException();
    } else {
      const currentUserStatus = comment.totalActions.find(
        (el) => el.userId === userId && el.isBanned === false,
      );
      const likesCount = comment.totalActions.filter(
        (el) => el.action === 'Like' && el.isBanned === false,
      ).length;
      const dislikesCount = comment.totalActions.filter(
        (el) => el.action === 'Dislike',
      ).length;
      return {
        createdAt: comment.createdAt,
        content: comment.content,
        id: comment.id,
        userId: comment.userId,
        userLogin: comment.userLogin,
        likesInfo: {
          dislikesCount: dislikesCount,
          likesCount: likesCount,
          myStatus: currentUserStatus ? currentUserStatus.action : 'None',
        },
      };
    }
  }
}
