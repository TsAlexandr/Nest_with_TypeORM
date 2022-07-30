import { InjectModel } from '@nestjs/mongoose';
import {
  Bloggers,
  BloggersDocument,
  Posts,
  PostsDocument,
} from '../schemas/schemas.model';
import { Model } from 'mongoose';
import { NewPost } from '../classes/classes';

export class PostsRepository {
  constructor(
    @InjectModel(Bloggers.name)
    private bloggersModel: Model<BloggersDocument>,
    @InjectModel(Posts.name) private postsModel: Model<PostsDocument>,
  ) {}
  async createPosts(createPost: Posts) {
    return await this.postsModel.create(createPost);
  }

  async getPosts(page: number, pageSize: number) {
    const post = await this.postsModel
      .find({}, { projection: { _id: 0 } })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .lean();
    const total = await this.postsModel.countDocuments({});
    const pages = Math.ceil(total / pageSize);
    return {
      pagesCount: pages,
      page: page,
      pageSize: pageSize,
      totalCount: total,
      items: post,
    };
  }

  async getPostById(id: string) {
    const post = await this.postsModel.find({ id }, { projection: { _id: 0 } });
    return post;
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
    return await this.postsModel.deleteOne({ id });
  }

  async getPostInPages(bloggerId: string, page: number, pageSize: number) {
    const postsByBloggerId = await this.postsModel
      .find({ bloggerId }, { projection: { _id: 0 } })
      .limit(page)
      .skip((pageSize - 1) * page)
      .lean();
    const total = await this.postsModel.countDocuments({ bloggerId });
    const pages = Math.ceil(total / page);

    return {
      pagesCount: pages,
      page: pageSize,
      pageSize: page,
      totalCount: total,
      items: postsByBloggerId,
    };
  }
}
