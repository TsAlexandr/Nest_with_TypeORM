import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

export class Bloggers {
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
  youtubeUrl: string;
}

export class PostsCon {
  @IsString()
  id?: string;

  @IsString()
  @IsNotEmpty()
  bloggerId: Bloggers['id'];

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

  bloggerName?: Bloggers['name'];
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

export class Comment {
  @IsString()
  @IsNotEmpty()
  postId: PostsCon['id'];
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsString()
  @IsNotEmpty()
  userId: string;
  userLogin: string;
}

export class User {
  constructor(
    public accountData: UserAccount,
    public emailConfirm: EmailConfirmType,
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
  sentEmails: SentConfirmEmailType[];
}

export class SentConfirmEmailType {
  sentDate: Date;
}

export class emailClass {
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

export class attemptsClass {
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
  action?: string;
  userId: string;
  login: string;
}
