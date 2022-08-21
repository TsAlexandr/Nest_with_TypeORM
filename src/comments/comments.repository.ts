import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentsDocument } from '../schemas/schemas.model';

export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private commentsModel: Model<CommentsDocument>,
  ) {}
  async findOne(id: string) {
    const getCom = await this.commentsModel.findOne(
      { id },
      { projection: { _id: 0, postId: 0 } },
    );
    return getCom;
  }

  async updateOne(id: string, content: string) {
    const updComment = await this.commentsModel.findOneAndUpdate(
      { id },
      { $set: { content: content } },
    );
    return updComment;
  }

  async remove(id: string) {
    const deleteComment = await this.commentsModel.deleteOne({ id });
    return deleteComment.deletedCount === 1;
  }

  async createComment(newComment: {
    userLogin: string;
    addedAt: Date;
    id: string;
    postId: string;
    userId: string;
    content: string;
  }) {
    return Promise.resolve(undefined);
  }

  async getCommentWithPage(
    postId: string,
    page: number,
    pageSize: number,
    userId: string,
  ) {
    const filter = { postId };
    const commentsForPosts = await this.commentsModel
      .find(filter, { projection: { _id: 0, postId: 0 } })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .lean();
    const total = await this.commentsModel.countDocuments(filter);
    const pages = Math.ceil(total / pageSize);

    const commInPages = {
      pagesCount: pages,
      page: page,
      pageSize: pageSize,
      totalCount: total,
      items: commentsForPosts,
    };
    return commInPages;
  }
}
