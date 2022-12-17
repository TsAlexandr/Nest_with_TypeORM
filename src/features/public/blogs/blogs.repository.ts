import { Model, SortOrder } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BloggersDocument,
  BloggersMongo,
  Posts,
  PostsDocument,
} from '../../../common/types/schemas/schemas.model';
import { Paginator } from '../../../common/types/classes/classes';
import { BloggersDto } from './dto/bloggers.dto';
import { BanBlogDto } from '../../blogger/dto/banBlog.dto';

@Injectable()
export class BlogsRepository {
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
  ): Promise<Paginator<BloggersMongo[]>> {
    const bloggers = await this.bloggersModel
      .find(
        { name: { $regex: searchNameTerm, $options: 'i' } },
        { _id: 0, __v: 0, blogOwnerInfo: 0 },
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

  async getBlogsById(id: string): Promise<BloggersMongo> {
    return this.bloggersModel
      .findOne({ id }, { _id: 0, __v: 0, blogOwnerInfo: 0 })
      .lean();
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
          websiteUrl: update.websiteUrl,
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
    return this.getBlogsById(newBlogger.id);
  }

  async bindWithUser(id: string, userId: string) {
    await this.bloggersModel.findByIdAndUpdate(
      { id },
      { $set: { 'blogOwnerInfo.userId': userId } },
    );
    return;
  }

  async getBlogsWithOwnerInfo(
    page: number,
    pageSize: number,
    searchNameTerm: string,
    sortBy: string,
    sortDirection: SortOrder,
  ): Promise<Paginator<BloggersMongo[]>> {
    const blogsWithUser = await this.bloggersModel
      .find(
        {
          name: { $regex: searchNameTerm, $options: 'i' },
          'banInfo.isBanned': true,
        },
        { _id: 0, __v: 0, blackList: 0 },
      )
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .lean();

    const count = await this.bloggersModel.countDocuments({
      name: { $regex: searchNameTerm, $options: 'i' },
      'banInfo.isBanned': true,
    });
    const total = Math.ceil(count / pageSize);

    return {
      pagesCount: total,
      page: page,
      pageSize: pageSize,
      totalCount: count,
      items: blogsWithUser,
    };
  }

  async getBlogsByBlogger(
    page: number,
    pageSize: number,
    searchNameTerm: string,
    sortBy: string,
    sortDirection: SortOrder,
    userId: string,
    login: string,
  ) {
    console.log(userId, login);
    const blogsByBlogger = await this.bloggersModel
      .find(
        {
          $and: [
            { name: { $regex: searchNameTerm, $options: 'i' } },
            { 'blogOwnerInfo.userId': { $regex: userId, $options: 'i' } },
            { 'blogOwnerInfo.userLogin': { $regex: login, $options: 'i' } },
          ],
        },
        { _id: 0, __v: 0, blogOwnerInfo: 0 },
      )
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .lean();

    const count = await this.bloggersModel.countDocuments({
      $and: [
        { name: { $regex: searchNameTerm, $options: 'i' } },
        { 'blogOwnerInfo.userId': { $regex: userId, $options: 'i' } },
        { 'blogOwnerInfo.userLogin': { $regex: login, $options: 'i' } },
      ],
    });
    const total = Math.ceil(count / pageSize);

    return {
      pagesCount: total,
      page: page,
      pageSize: pageSize,
      totalCount: count,
      items: blogsByBlogger,
    };
  }

  async getBannedUsers(
    page: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortOrder,
    searchLoginTerm: string,
    id: string,
    ownerId: string,
  ) {
    const bannedUsers = await this.bloggersModel
      .find({
        $and: [
          { 'blogOwnerInfo.userId': ownerId },
          { 'blackList.$.login': { $regex: searchLoginTerm, $options: 'i' } },
          { 'blackList.$.id': { $regex: id, $options: 'i' } },
        ],
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .lean();
    const count = await this.bloggersModel.countDocuments({
      $and: [
        { 'blogOwnerInfo.userId': ownerId },
        { 'blackList.$.login': { $regex: searchLoginTerm, $options: 'i' } },
        { 'blackList.$.id': { $regex: id, $options: 'i' } },
      ],
    });

    return {
      bannedUsers,
      count,
    };
  }

  async banUserForBlog(banBlogDto: BanBlogDto, id: string, login: string) {
    if (banBlogDto.isBanned === false) {
      await this.bloggersModel.updateOne(
        { id: banBlogDto.blogId },
        {
          $pull: {
            blackList: { id: id },
          },
        },
      );
    } else {
      await this.bloggersModel.updateOne(
        { id: banBlogDto.blogId },
        {
          $set: {
            'blackList.id': id,
            'blackList.login': login,
            'blackList.isBanned': banBlogDto.isBanned,
            'blackList.banDate': new Date().toISOString(),
            'blackList.banReason': banBlogDto.banReason,
          },
        },
      );
    }
  }

  async getBlogsWithOwnerId(ownerId: string) {
    return;
  }

  async banBlogById(id: string, isBanned: boolean) {
    await this.bloggersModel.updateOne(
      { id },
      {
        $set: {
          'banInfo.isBanned': isBanned,
          'banInfo.banDate': new Date().toISOString(),
        },
      },
    );
  }
}
