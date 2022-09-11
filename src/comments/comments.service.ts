import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { v4 } from 'uuid';

@Injectable()
export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {}

  async findComment(commentId: string, userId: string) {
    return await this.commentsRepository.findComment(commentId, userId);
  }

  async updateComment(id: string, content: string) {
    return await this.commentsRepository.updateComment(id, content);
  }

  async deleteComment(id: string) {
    return await this.commentsRepository.deleteComment(id);
  }

  async createComment(
    postId: string,
    content: string,
    userId: string,
    userLogin: string,
  ) {
    const newComments = {
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
    const comment = await this.commentsRepository.createComment(newComments);
    return comment;
  }

  async getCommentWithPage(
    postId: string,
    page: number,
    pageSize: number,
    userId: string | null,
  ) {
    return await this.commentsRepository.getCommentWithPage(
      postId,
      page,
      pageSize,
      userId,
    );
  }

  async updateLikes(
    commentId: string,
    status: string,
    userId: string,
    login: string,
  ) {
    const date = new Date();
    const update = await this.commentsRepository.updateLikes(
      commentId,
      status,
      userId,
      login,
      date,
    );
    return update;
  }
}
