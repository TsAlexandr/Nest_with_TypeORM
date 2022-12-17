import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCommentsCommand } from '../queryCommands/getComments.command';
import { CommentsRepository } from '../../public/comments/comments.repository';

@QueryHandler(GetCommentsCommand)
export class GetCommentsHandler implements IQueryHandler<GetCommentsCommand> {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(query: GetCommentsCommand) {
    const { postId, page, pageSize, userId, sortBy, sortDirection } = query;
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
