import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BloggersDocument,
  BloggersMongo,
  Comments,
  CommentsDocument,
  Device,
  DeviceDocument,
  Posts,
  PostsDocument,
  UserDocument,
  UserMongo,
} from '../../common/types/schemas/schemas.model';
import { Model } from 'mongoose';
import mongoose from 'mongoose';

export class TestRepo {
  constructor(
    @InjectModel(BloggersMongo.name)
    private bloggersModel: Model<BloggersDocument>,
    @InjectModel(Posts.name) private postsModel: Model<PostsDocument>,
    @InjectModel(UserMongo.name) private usersModel: Model<UserDocument>,
    @InjectModel(Comments.name)
    private commentsModel: mongoose.Model<CommentsDocument>,
    @InjectModel(Device.name)
    private deviceModel: mongoose.Model<DeviceDocument>,
  ) {}

  async removeAllData() {
    await this.bloggersModel.deleteMany();
    await this.postsModel.deleteMany();
    await this.usersModel.deleteMany();
    await this.commentsModel.deleteMany();
    await this.deviceModel.deleteMany();
  }
}

@Controller('testing')
export class TruncateBase {
  constructor(private testRepo: TestRepo) {}

  @HttpCode(204)
  @Delete('/all-data')
  async dropData() {
    await this.testRepo.removeAllData();
    return;
  }
}
