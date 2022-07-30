import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Bloggers,
  BloggersDocument,
  Posts,
  PostsDocument,
} from '../schemas/schemas.model';
import { Paginator } from '../classes/classes';

@Injectable()
export class BloggersRepository {
  constructor(
    @InjectModel(Bloggers.name) private bloggersModel: Model<BloggersDocument>,
    @InjectModel(Posts.name) private postsModel: Model<PostsDocument>,
  ) {}
  async getBloggers(
    page: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<Paginator<Bloggers[]>> {
    const filter = { name: { $regex: searchNameTerm ? searchNameTerm : '' } };
    const bloggers = await this.bloggersModel
      .find(filter, { projection: { _id: 0 } })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const count = await this.bloggersModel.countDocuments(filter);
    const total = Math.ceil(count / pageSize);

    return {
      pagesCount: total,
      page: page,
      pageSize: pageSize,
      totalCount: count,
      items: bloggers,
    };
  }

  async getBloggersById(id: string) {
    const blogger = await this.bloggersModel
      .findOne({ id }, { projection: { _id: 0 } })
      .lean();
    return blogger;
  }

  async deleteBloggerById(id: string) {
    const delBlog = await this.bloggersModel.deleteOne({ id });
    return delBlog.deletedCount === 1;
  }

  async updateBloggerById(id: string, name: string, youtubeUrl: string) {
    const updBlog = await this.bloggersModel.findOneAndUpdate(
      { id },
      {
        $set: {
          name: name,
          youtubeUrl: youtubeUrl,
        },
      },
    );
    await this.postsModel.updateMany(
      { bloggerId: id },
      { $set: { bloggerName: name } },
    );
    return updBlog;
  }

  async createBlogger(newBlogger: Bloggers) {
    await this.bloggersModel.create(newBlogger);
    return newBlogger;
  }
}
