import { InjectModel } from '@nestjs/mongoose';
import { Bloggers, Posts } from '../common/types/schemas/schemas.model';
import { NewPost, UserAccount } from '../common/types/classes/classes';

export class PostsRepository {
  constructor(
    @InjectModel(Bloggers.name) private bloggersModel,
    @InjectModel(Posts.name) private postsModel,
  ) {}

  async getPosts(
    page: number,
    pageSize: number,
    userId: string,
    bloggerId: string | null,
    searchNameTerm: string,
  ) {
    const filter = bloggerId
      ? { title: { $regex: searchNameTerm ? searchNameTerm : '' }, bloggerId }
      : { title: { $regex: searchNameTerm ? searchNameTerm : '' } };

    const post = await this.postsModel
      .find(filter, { projection: { _id: 0 } })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .lean();
    const total = await this.postsModel.countDocuments(filter);
    const pages = Math.ceil(total / pageSize);
    const postAfterDeleteField = post.map((obj) => {
      const currentUserStatus = obj.totalActions?.find(
        (el) => el.userId === userId,
      );
      const likesCount = obj.totalActions?.filter(
        (el) => el.action === 'Like',
      ).length;
      const dislikesCount = obj.totalActions?.filter(
        (el) => el.action === 'Dislike',
      ).length;
      const actions = obj.totalActions;
      return {
        id: obj.id,
        title: obj.title,
        shortDescription: obj.shortDescription,
        content: obj.content,
        bloggerId: obj.bloggerId,
        addedAt: obj.addedAt,
        bloggerName: obj.bloggerName,
        extendedLikesInfo: {
          likesCount: likesCount,
          dislikesCount: dislikesCount,
          myStatus: currentUserStatus ? currentUserStatus.action : 'None',
          newestLikes: actions
            ?.filter((el) => el.action === 'Like')
            .reverse()
            .slice(0, 3)
            .map((el) => {
              delete el.action;
              return el;
            }),
        },
      };
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
    const post = await this.postsModel.find({ id }, { projection: { _id: 0 } });
    if (!post) return null;
    if (!userId) {
      return {
        addedAt: post.addedAt,
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        bloggerId: post.bloggerId,
        bloggerName: post.bloggerName,
        extendedLikesInfo: {
          dislikesCount: 0,
          likesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      };
    }
    const currentUserStatus = post.totalActions?.find(
      (el: { userId: string }) => el.userId === userId,
    );
    const likesCount = post.totalActions?.filter(
      (el) => el.action === 'Like',
    ).length;
    const dislikesCount = post.totalActions?.filter(
      (el) => el.action === 'Dislike',
    ).length;
    const actions = post.totalActions;
    return {
      addedAt: post.addedAt,
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      bloggerId: post.bloggerId,
      bloggerName: post.bloggerName,
      extendedLikesInfo: {
        likesCount: likesCount,
        dislikesCount: dislikesCount,
        myStatus: currentUserStatus ? currentUserStatus.action : 'None',
        newestLikes: actions
          ?.filter((el) => el.action === 'Like')
          .reverse()
          .slice(0, 3)
          .map((el) => {
            delete el.action;
            return el;
          }),
      },
    };
  }

  async createPosts(createPost: Posts) {
    const post = await this.postsModel.create(createPost);
    return {
      addedAt: post.addedAt,
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      bloggerId: post.bloggerId,
      bloggerName: post.bloggerName,
      extendedLikesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }

  async updatePost(
    id: string,
    bloggerId: string,
    bloggerName: string,
    updPost: NewPost,
  ) {
    const update = {
      id,
      bloggerId,
      bloggerName,
      ...updPost,
    };
    const post = await this.postsModel.updateOne(
      { id },
      { $set: { ...update } },
      { upsert: true },
    );
    return post.modifiedCount === 1;
  }

  async deletePost(id: string) {
    const isDeleted = await this.postsModel.deleteOne({ id });
    return isDeleted.deletedCount === 1;
  }

  async updateActions(likeStatus: string, user: UserAccount, postId: string) {
    if (likeStatus === 'Like' || 'Dislike' || 'None') {
      await this.postsModel.updateOne(
        { postId },
        { $pull: { totalActions: { userId: user.id } } },
      );
    }
    if (likeStatus === 'Like' || 'Dislike') {
      const updateLike = await this.postsModel.updateOne(
        { postId },
        {
          $push: {
            totalActions: {
              addedAt: new Date(),
              action: likeStatus,
              userId: user.id,
              login: user.login,
            },
          },
        },
      );
      return updateLike.modifiedCount === 1;
    }
  }
}
