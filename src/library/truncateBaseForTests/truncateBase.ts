import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BloggersDocument,
  BloggersMongo,
  Comments,
  Posts,
  PostsDocument,
} from '../../common/types/schemas/schemas.model';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { User } from '../../common/types/classes/classes';

export class TestRepo {
  constructor(
    @InjectModel(BloggersMongo.name)
    private bloggersModel: Model<BloggersDocument>,
    @InjectModel(Posts.name) private postsModel: Model<PostsDocument>,
    @InjectModel('Users') private usersModel: mongoose.Model<User>,
    @InjectModel(Comments.name) private commentsModel: mongoose.Model<Comment>,
  ) {}

  async removeAllData() {
    await this.bloggersModel.collection.dropIndexes();
    await this.bloggersModel.deleteMany();
    await this.postsModel.deleteMany();
    await this.usersModel.deleteMany();
    await this.commentsModel.deleteMany();
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
