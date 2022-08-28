import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Comment,
  CommentsDocument,
} from '../common/types/schemas/schemas.model';
import { UserAccount } from '../common/types/classes/classes';

export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private commentsModel: Model<CommentsDocument>,
  ) {}
  async findOne(id: string, userId: null) {
    const comment = await this.commentsModel.findOne(
      { id },
      {
        _id: 0,
        postId: 0,
        __v: 0,
      },
    );
    if (!comment) return null;
    const currentUserStatus = comment.totalActions?.find(
      (el: { userId: string }) => el.userId === userId,
    );
    const likesCount = comment.totalActions?.filter(
      (el) => el.action === 'Like',
    ).length;
    const dislikesCount = comment.totalActions?.filter(
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
    userId: string | null,
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
      const currentUserStatus = obj.totalActions?.find(
        (el: { userId: string }) => el.userId === userId,
      );
      const likesCount = obj.totalActions?.filter(
        (el) => el.action === 'Like',
      ).length;
      const dislikesCount = obj.totalActions?.filter(
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

  async createComment(newComment: Comment): Promise<Comment | null> {
    await this.commentsModel.create(newComment);
    const newComma = await this.commentsModel.findOne<Comment>(
      { id: newComment.id },
      {
        postId: false,
        _id: false,
        __v: 0,
      },
    );
    if (!newComma) {
      return null;
    }
    return newComma;
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

  async updateActions(
    id: string,
    status: string,
    user: UserAccount,
    addedAt: Date,
  ) {
    if (status === 'Like' || status === 'Dislike' || status === 'None') {
      await this.commentsModel.updateOne(
        { id },
        { $pull: { totalActions: { userId: user.id } } },
      );
    }
    if (status === 'Like' || status === 'Dislike') {
      const updateLike = await this.commentsModel.updateOne(
        { id },
        {
          $push: {
            totalActions: {
              addedAt,
              action: status,
              userId: user.id,
              login: user.login,
            },
          },
        },
      );
      return updateLike;
    }
  }
}
