import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCommentByIdCommmand } from '../commands/getCommentById.commmand';
import { CommentsRepository } from '../../public/comments/comments.repository';
import { UsersRepository } from '../../sa/users/users.repository';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetCommentByIdCommmand)
export class GetCommentByIdHandler
  implements IQueryHandler<GetCommentByIdCommmand>
{
  constructor(
    private commentsRepository: CommentsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: GetCommentByIdCommmand) {
    const { id } = command;
    const comment = await this.commentsRepository.findComment(id);
    console.log(comment);
    if (!comment) throw new NotFoundException();
    const user = await this.usersRepository.findById(comment.userId);
    if (user.banInfo.isBanned === false) {
      const currentUserStatus = comment.totalActions.find(
        (el) => el.userId === user.id,
      );
      const likesCount = comment.totalActions.filter(
        (el) => el.action === 'Like',
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
          dislikesCount: dislikesCount
            ? dislikesCount
            : comment.likesInfo.dislikesCount,
          likesCount: likesCount ? likesCount : comment.likesInfo.likesCount,
          myStatus: currentUserStatus ? currentUserStatus.action : 'None',
        },
      };
    } else {
      throw new NotFoundException();
    }
  }
}
