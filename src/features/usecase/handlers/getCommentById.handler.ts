import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCommentByIdCommmand } from '../commands/getCommentById.commmand';
import { CommentsRepository } from '../../public/comments/comments.repository';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetCommentByIdCommmand)
export class GetCommentByIdHandler
  implements IQueryHandler<GetCommentByIdCommmand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: GetCommentByIdCommmand) {
    const { id, userId } = command;
    const comment = await this.commentsRepository.findComment(id);
    if (!comment) throw new NotFoundException();
    const actionsSize = comment.totalActions.filter(
      (el) => el.action === 'Like' && el.isBanned === false,
    ).length;
    if (actionsSize > 0) {
      const currentUserStatus = comment.totalActions.find(
        (el) => el.userId === userId,
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
    } else {
      throw new NotFoundException();
    }
  }
}
