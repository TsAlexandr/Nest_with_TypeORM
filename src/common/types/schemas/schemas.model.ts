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

@Schema()
export class BloggersMongo {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  youtubeUrl: string;
}

export const BloggerSchema = SchemaFactory.createForClass(BloggersMongo);

export type PostsDocument = Posts & Document;

@Schema()
export class Posts {
  @Prop()
  addedAt: Date;

  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  shortDescription: string;

  @Prop()
  content: string;

  @Prop()
  blogId: string;

  @Prop()
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

@Schema()
export class Comments {
  @Prop()
  id: string;
  @Prop()
  postId: string;
  @Prop()
  content: string;
  @Prop()
  userId: string;
  @Prop()
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

@Schema()
export class Device {
  @Prop()
  ip: string;

  @Prop()
  title: string;

  @Prop()
  lastActiveDate: Date;

  @Prop()
  deviceId: string;

  @Prop()
  userId: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
