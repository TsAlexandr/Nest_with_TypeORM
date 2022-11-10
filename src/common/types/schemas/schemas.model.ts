import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import {
  Action,
  EmailConfirmType,
  LikesInfo,
  TotalActions,
  User,
  UserAccount,
} from '../classes/classes';

export type BloggersDocument = BloggersMongo & Document;

@Schema({ versionKey: false })
export class BloggersMongo {
  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  youtubeUrl: string;
}

export const BloggerSchema = SchemaFactory.createForClass(BloggersMongo);

export type PostsDocument = Posts & Document;

@Schema({ versionKey: false })
export class Posts {
  @Prop()
  addedAt: Date;

  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  shortDescription: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ ref: () => `${BloggersMongo}` })
  blogId: string;

  @Prop({ type: String, required: true })
  blogName: string;

  @Prop({ type: Action })
  extendedLikesInfo: {
    dislikesCount: number;
    likesCount: number;
    myStatus: string;
    newestLikes: any[];
  };
  @Prop({ type: TotalActions })
  totalActions: {
    addedAt: Date;
    action: string;
    userId: string;
    login: string;
  }[];
}

export const PostsSchema = SchemaFactory.createForClass(Posts);

export type CommentsDocument = Comments & Document;

@Schema({ versionKey: false })
export class Comments {
  @Prop({ type: String, required: true })
  id: string;
  @Prop({ type: String, required: true })
  postId: string;
  @Prop({ type: String, required: true })
  content: string;
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  userLogin: string;
  @Prop()
  addedAt: Date;
  @Prop({ type: LikesInfo })
  likesInfo: {
    dislikesCount: number;
    likesCount: number;
    myStatus: string;
  };
  @Prop({ type: TotalActions })
  totalActions: {
    addedAt: Date;
    action: string;
    userId: string;
    login: string;
  }[];
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);

export const InfoAboutUser = new mongoose.Schema<UserAccount>({
  id: String,
  email: String,
  login: String,
  passwordHash: String,
  createdAt: Date,
  unused: String,
});

export const EmailInfo = new mongoose.Schema<EmailConfirmType>({
  isConfirmed: Boolean,
  confirmationCode: String,
  sentEmails: { type: [Date], required: false },
});

export const UsersSchema = new mongoose.Schema<User>({
  accountData: InfoAboutUser,
  emailConfirm: EmailInfo,
});

// export const LikesSchema = new mongoose.Schema<TotalActions>({
//   action: String,
//   userId: String,
//   addedAt: Date,
//   login: String,
//   postId: String,
// });

export type DeviceDocument = Device & Document;

@Schema({ versionKey: false })
export class Device {
  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: Date, required: true, default: Date.now })
  lastActiveDate: Date;

  @Prop({ type: Date, required: true, default: Date.now })
  expiredDate: Date;

  @Prop({ type: String, required: true })
  deviceId: string;

  @Prop({ type: String, required: true })
  userId: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
