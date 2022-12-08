import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetCommentsCommand } from '../commands/getComments.command';
import { CommentsRepository } from '../../public/comments/comments.repository';

@CommandHandler(GetCommentsCommand)
export class GetCommentsHandler implements ICommandHandler<GetCommentsCommand> {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: GetCommentsCommand) {
    const { postId, page, pageSize, userId, sortBy, sortDirection } = command;
    return this.commentsRepository.getCommentWithPage(
      postId,
      page,
      pageSize,
      userId,
      sortBy,
      sortDirection,
    );
  }
}
