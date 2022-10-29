import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentCommand } from '../commands/createComment.command';
import { CommentsService } from '../../../features/comments/comments.service';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(private commentsService: CommentsService) {}

  async execute(command: CreateCommentCommand) {
    const { postId, content, userId, userLogin } = command;
    const comment = await this.commentsService.createComment(
      postId,
      content,
      userId,
      userLogin,
    );
    return comment;
  }
}
