import { InjectModel } from '@nestjs/mongoose';
import {
  Comments,
  CommentsDocument,
} from '../common/types/schemas/schemas.model';
import { Model } from 'mongoose';

export class CommentsRepository {
  constructor(
    @InjectModel(Comments.name) private commentsModel: Model<CommentsDocument>,
  ) {}
  async findComment(commentId: string, userId: string) {
    const comment = await this.commentsModel.findOne(
      { id: commentId },
      {
        _id: 0,
        postId: 0,
        __v: 0,
      },
    );
    if (!comment) return null;
    const currentUserStatus = comment.totalActions.find(
      (el) => el.userId === userId,
    );
    const likesCount = comment.totalActions.filter(
      (el) => el.action === 'Like',
    ).length;
    const dislikesCount = comment.totalActions.filter(
      (el) => el.action === 'Dislike',
    ).length;
    return {
      addedAt: comment.addedAt,
      content: comment.content,
      id: comment.id,
      userId: comment.userId,
      userLogin: comment.userLogin,
      likesInfo: {
        dislikesCount: dislikesCount
          ? dislikesCount
          : comment.likesInfo.dislikesCount,
        likesCount: likesCount ? likesCount : comment.likesInfo.likesCount,
        myStatus: currentUserStatus ? currentUserStatus.action : 'None',
      },
    };
  }

  async getCommentWithPage(
    postId: string,
    page: number,
    pageSize: number,
    userId: string,
  ) {
    const filter = { postId };
    const commentsForPosts = await this.commentsModel
      .find(filter, { _id: 0, postId: 0, __v: 0 })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .lean();
    const total = await this.commentsModel.countDocuments(filter);
    const pages = Math.ceil(total / pageSize);

    const commentAfterDeleteField = commentsForPosts.map((obj) => {
      const currentUserStatus = obj.totalActions.find(
        (el: { userId: string }) => el.userId === userId,
      );
      const likesCount = obj.totalActions.filter(
        (el) => el.action === 'Like',
      ).length;
      const dislikesCount = obj.totalActions.filter(
        (el) => el.action === 'Dislike',
      ).length;
      return {
        addedAt: obj.addedAt,
        content: obj.content,
        id: obj.id,
        likesInfo: {
          dislikesCount: dislikesCount,
          likesCount: likesCount,
          myStatus: currentUserStatus ? currentUserStatus.action : 'None',
        },
        userId: obj.userId,
        userLogin: obj.userLogin,
      };
    });
    return {
      pagesCount: pages,
      page: page,
      pageSize: pageSize,
      totalCount: total,
      items: commentAfterDeleteField,
    };
  }

  async createComment(newComment: Comments) {
    await this.commentsModel.create(newComment);
    const comment = await this.findComment(newComment.id, newComment.userId);
    return comment;
  }

  async updateComment(id: string, content: string) {
    const updComment = await this.commentsModel.findOneAndUpdate(
      { id },
      { $set: { content: content } },
    );
    return updComment;
  }

  async deleteComment(id: string) {
    const deleteComment = await this.commentsModel.deleteOne({ id });
    return deleteComment.deletedCount === 1;
  }

  async updateLikes(
    commentId: string,
    status: string,
    userId: string,
    login: string,
    addedAt: Date,
  ) {
    if (status === 'Like' || status === 'Dislike' || status === 'None') {
      await this.commentsModel.updateOne(
        { id: commentId },
        { $pull: { totalActions: { userId: userId } } },
      );
    }
    if (status === 'Like' || status === 'Dislike') {
      const updateLike = await this.commentsModel.updateOne(
        { id: commentId },
        {
          $push: {
            totalActions: {
              addedAt,
              action: status,
              userId: userId,
              login: login,
            },
          },
        },
      );
      return updateLike;
    }
  }
}
