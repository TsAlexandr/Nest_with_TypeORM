import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentCommand } from '../commands/createComment.command';
import { CommentsRepository } from '../../comments/comments.repository';
import { v4 } from 'uuid';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: CreateCommentCommand) {
    const { postId, content, userId, userLogin } = command;
    const newComment = {
      id: v4(),
      postId,
      content,
      userId,
      userLogin,
      addedAt: new Date(),
      likesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: 'None',
      },
      totalActions: [],
    };
    const comment = await this.commentsRepository.createComment(newComment);
    return comment;
  }
}
