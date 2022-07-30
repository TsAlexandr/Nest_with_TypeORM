import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  EmailConfirmType,
  LoginAttempts,
  PostsCon,
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
  bloggerName?: string;
}

export const PostsSchema = SchemaFactory.createForClass(Posts);

export type CommentsDocument = Comment & Document;

export class Comment {
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
}

export const CommentsSchema = SchemaFactory.createForClass(Comment);

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

export type UsersDocument = User & Document;

export class User {
  @Prop()
  accountData: UserAccount;
  @Prop()
  loginAttempts: LoginAttempts[];
  @Prop()
  emailConfirm: EmailConfirmType;
}

export const UsersSchema = SchemaFactory.createForClass(User);
