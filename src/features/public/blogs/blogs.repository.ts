import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BloggersDocument,
  BloggersMongo,
  Posts,
  PostsDocument,
} from '../../../common/types/schemas/schemas.model';
import { Blogger, Paginator } from '../../../common/types/classes/classes';
import { BloggersDto } from './dto/bloggers.dto';
import { IBlogsRepository } from '../../../common/interfaces/IBlogsRepository';

@Injectable()
export class BlogsRepository implements IBlogsRepository {
  constructor(
    @InjectModel(BloggersMongo.name)
    private bloggersModel: Model<BloggersDocument>,
    @InjectModel(Posts.name) private postsModel: Model<PostsDocument>,
  ) {}

  async getBloggers(
    page: number,
    pageSize: number,
    searchNameTerm: string,
    sortBy: string,
    sortDirection: any,
  ): Promise<Paginator<Blogger[]>> {
    const bloggers = await this.bloggersModel
      .find(
        { name: { $regex: searchNameTerm, $options: 'i' } },
        { _id: 0, __v: 0 },
      )
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .lean();

    const count = await this.bloggersModel.countDocuments({
      name: { $regex: searchNameTerm, $options: 'i' },
    });
    const total = Math.ceil(count / pageSize);

    return {
      pagesCount: total,
      page: page,
      pageSize: pageSize,
      totalCount: count,
      items: bloggers,
    };
  }

  async getBloggersById(id: string): Promise<BloggersMongo> {
    return this.bloggersModel.findOne({ id }, { _id: 0, __v: 0 }).lean();
  }

  async deleteBloggerById(id: string): Promise<boolean> {
    const delBlog = await this.bloggersModel.deleteOne({ id });
    return delBlog.deletedCount === 1;
  }

  async updateBloggerById(id: string, update: BloggersDto): Promise<boolean> {
    const updBlog = await this.bloggersModel.updateOne(
      { id },
      {
        $set: {
          name: update.name,
          youtubeUrl: update.websiteUrl,
          description: update.description,
        },
      },
    );
    await this.postsModel.updateMany(
      { blogsId: id },
      { $set: { bloggerName: update.name } },
    );
    return updBlog.modifiedCount === 1;
  }

  async createBlogger(newBlogger: BloggersMongo): Promise<BloggersMongo> {
    await this.bloggersModel.create(newBlogger);
    return this.getBloggersById(newBlogger.id);
  }

  async bindWithUser(id: string, userId: string) {
    await this.bloggersModel.findByIdAndUpdate(
      { id },
      { $set: { 'blogOwnerInfo.userId': userId } },
    );
    return;
  }
}
