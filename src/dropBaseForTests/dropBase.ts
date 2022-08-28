import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Bloggers,
  BloggersDocument,
  Comment,
  CommentsDocument,
  Posts,
  PostsDocument,
} from '../common/types/schemas/schemas.model';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { User } from '../common/types/classes/classes';

export class TestRepo {
  constructor(
    @InjectModel(Bloggers.name) private bloggersModel: Model<BloggersDocument>,
    @InjectModel(Posts.name) private postsModel: Model<PostsDocument>,
    @InjectModel('Users') private usersModel: mongoose.Model<User>,
    @InjectModel(Comment.name) private commentsModel: Model<CommentsDocument>,
  ) {}
  async removeAllData() {
    await this.bloggersModel.deleteMany();
    await this.postsModel.deleteMany();
    await this.usersModel.deleteMany();
    await this.commentsModel.deleteMany();
  }
}

@Controller('testing')
export class DropBase {
  constructor(private testRepo: TestRepo) {}
  @HttpCode(204)
  @Delete('/all-data')
  async dropData() {
    await this.testRepo.removeAllData();
    return;
  }
}
