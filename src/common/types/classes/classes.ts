import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { Prop } from '@nestjs/mongoose';

export class Blogger {
  @IsString()
  @IsNotEmpty()
  id: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  name: string;
  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/)
  @IsNotEmpty()
  @MaxLength(100)
  websiteUrl: string;
  @IsString()
  description: string;
  @IsString()
  createdAt: Date;
}

export class PostsCon {
  @IsString()
  id?: string;

  @IsString()
  @IsNotEmpty()
  blogId: Blogger['id'];

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;

  blogName: Blogger['name'];
}

export class NewPost {
  @IsString()
  @Length(1, 30)
  @IsNotEmpty()
  title: string;
  @IsString()
  @Length(1, 100)
  @IsNotEmpty()
  shortDescription: string;
  @IsString()
  @Length(1, 1000)
  @IsNotEmpty()
  content: string;
}

export class BanInfoType {
  banDate: Date;
  banReason: string;
  isBanned: boolean;
}

export class User {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public createdAt: any,
    public passwordHash: string,
    public emailConfirmation: EmailConfirmType,
    public recoveryData: RecoveryDataType,
    public banInfo: BanInfoType,
  ) {}
}

export class UserAccount {
  @IsString()
  @IsNotEmpty()
  id: string;
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  login: string;
  passwordHash: string;
  createdAt: Date;
  unused?: string;
}

export class LoginAttempts {
  attemptDate: Date;
  ip: string;
}

export class EmailConfirmType {
  isConfirmed: boolean;
  confirmationCode: string;
}

export class RecoveryDataType {
  recoveryCode: string;
  isConfirmed: boolean;
  expirationDate: any;
}

export class SentConfirmEmailType {
  sentDate: Date;
}

export class EmailClass {
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  message: string;
  subject: string;
  isSent: boolean;
  createdAt: Date;
}

export class AttemptsClass {
  userIp: string;
  url: string;
  time: Date;
}

export type Paginator<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T;
};

export class Action {
  dislikesCount: number;
  likesCount: number;
  myStatus: string;
  newestLikes: any[];
}

export class LikesInfo {
  dislikesCount: number;
  likesCount: number;
  myStatus: string;
}

export class TotalActions {
  addedAt: Date;
  action: string;
  userId: string;
  login: string;
}

export enum Actions {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}
