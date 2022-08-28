import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { v4 } from 'uuid';
import { UserAccount } from '../common/types/classes/classes';

@Injectable()
export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {}

  async findOne(id: string, userId: null) {
    return await this.commentsRepository.findOne(id, userId);
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
      likesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: 'None',
      },
    };
    return await this.commentsRepository.createComment(newComment);
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

  async updateActions(id: string, status: string, user: UserAccount) {
    const date = new Date();
    const update = await this.commentsRepository.updateActions(
      id,
      status,
      user,
      date,
    );
    return update;
  }
}
