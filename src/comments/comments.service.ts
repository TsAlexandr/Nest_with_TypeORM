import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { v4 } from 'uuid';

@Injectable()
export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {}

  async findOne(id: string) {
    return await this.commentsRepository.findOne(id);
  }

  async update(id: string, content: string) {
    return await this.commentsRepository.updateOne(id, content);
  }

  async remove(id: string) {
    return await this.commentsRepository.remove(id);
  }

  async createComment(
    postId: string,
    content: string,
    userId: string,
    userLogin: string,
  ) {
    const newComment = {
      id: v4(),
      postId,
      content,
      userId,
      userLogin,
      addedAt: new Date(),
    };
    return await this.commentsRepository.createComment(newComment);
  }

  async getCommentWithPage(postId: string, page: number, pageSize: number) {
    return await this.commentsRepository.getCommentWithPage(
      postId,
      page,
      pageSize,
    );
  }
}
