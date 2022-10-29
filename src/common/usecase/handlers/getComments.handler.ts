import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetCommentsCommand } from '../commands/getComments.command';
import { CommentsService } from '../../../features/comments/comments.service';

@CommandHandler(GetCommentsCommand)
export class GetCommentsHandler implements ICommandHandler<GetCommentsCommand> {
  constructor(private commentsService: CommentsService) {}
  async execute(command: GetCommentsCommand) {
    const { postId, page, pageSize, userId } = command;
    const comments = await this.commentsService.getCommentWithPage(
      postId,
      page,
      pageSize,
      userId,
    );
    return comments;
  }
}
