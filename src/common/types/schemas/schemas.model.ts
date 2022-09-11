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

export type BloggersDocument = Bloggers & Document;

@Schema()
export class Bloggers {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  youtubeUrl: string;
}

export const BloggerSchema = SchemaFactory.createForClass(Bloggers);

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
  bloggerId: string;

  @Prop()
  bloggerName: string;

  @Prop({ type: Action })
  extendedLikesInfo: Action;
  @Prop({ type: TotalActions })
  totalActions: TotalActions[];
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
  likesInfo: LikesInfo;
  @Prop({ type: TotalActions })
  totalActions: TotalActions[];
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);

export type AttemptsDocument = Attempts & Document;

export class Attempts {
  @Prop()
  userIp: string;
  @Prop()
  url: string;
  @Prop()
  time: Date;
}

export const AttemptsSchema = SchemaFactory.createForClass(Attempts);

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
