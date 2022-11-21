import { InjectModel } from '@nestjs/mongoose';
import { PostsDocument } from '../../common/types/schemas/schemas.model';
import { Paginator, PostsCon } from '../../common/types/classes/classes';
import { Model } from 'mongoose';
import { mapper } from '../../common/helpers/helpers';

export class PostsRepository {
  constructor(@InjectModel('Posts') private postsModel: Model<PostsDocument>) {}

  async getPosts(
    page: number,
    pageSize: number,
    userId: string,
    blogId: string | null,
    searchNameTerm: string,
    sortBy: string,
    sortDirection: any,
  ): Promise<Paginator<PostsCon[]>> {
    const filter = blogId
      ? { title: { $regex: searchNameTerm ? searchNameTerm : '' }, blogId }
      : { title: { $regex: searchNameTerm ? searchNameTerm : '' } };

    const post = await this.postsModel
      .find(filter, { projection: { _id: 0 } })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort({ [sortBy]: sortDirection })
      .lean();
    const total = await this.postsModel.countDocuments(filter);
    const pages = Math.ceil(total / pageSize);
    const postAfterDeleteField = post.map((obj) => {
      return mapper(obj, userId);
    });
    return {
      pagesCount: pages,
      page: page,
      pageSize: pageSize,
      totalCount: total,
      items: postAfterDeleteField,
    };
  }

  async getPostById(id: string, userId: string) {
    const post = await this.postsModel.findOne({ id }).lean();
    if (!post) return null;
    if (!userId) {
      return {
        createdAt: post.createdAt,
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        extendedLikesInfo: {
          dislikesCount: 0,
          likesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      };
    } else {
      return mapper(post, userId);
    }
  }

  async createPosts(createPost: any) {
    const post = await this.postsModel.create(createPost);
    return {
      createdAt: post.createdAt,
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      extendedLikesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }

  async updatePost(updPost: any) {
    const post = await this.postsModel.updateOne(
      { id: updPost.id },
      { $set: { ...updPost } },
      { upsert: true },
    );
    return post.modifiedCount === 1;
  }

  async deletePost(id: string) {
    const isDeleted = await this.postsModel.deleteOne({ id });
    return isDeleted.deletedCount === 1;
  }

  async updateActions(
    postId: string,
    likeStatus: string,
    userId: string,
    login: string,
  ) {
    if (likeStatus === 'Like' || 'Dislike' || 'None') {
      await this.postsModel.findOneAndUpdate(
        { id: postId },
        { $pull: { totalActions: { userId: userId } } },
      );
    }
    if (likeStatus === 'Like' || 'Dislike') {
      const updateLike = await this.postsModel.findOneAndUpdate(
        { id: postId },
        {
          $push: {
            totalActions: {
              addedAt: new Date(),
              action: likeStatus,
              userId: userId,
              login: login,
            },
          },
        },
      );
      return null;
    }
  }
}
