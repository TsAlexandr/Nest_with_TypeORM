export class Bloggers {
  constructor(
    public id: string,
    public name: string,
    public youtubeUrl: string,
  ) {}
}

export class PostsCon {
  constructor(
    public id: string,
    public bloggerId: Bloggers['id'],
    public title: string,
    public shortDescription: string,
    public content: string,
    public bloggerName?: Bloggers['name'],
  ) {}
}

export class NewPost {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
  ) {}
}

export class Comment {
  constructor(
    public id: string,
    public postId: PostsCon['id'],
    public content: string,
    public userId: string,
    public userLogin: string,
    public addedAt: Date,
  ) {}
}

export class User {
  constructor(
    public accountData: UserAccount,
    public loginAttempts: LoginAttempts[],
    public emailConfirm: EmailConfirmType,
  ) {}
}

export class UserAccount {
  constructor(
    public id: string,
    public email: string,
    public login: string,
    public passwordHash: string,
    public createdAt: Date,
    public unused?: string,
  ) {}
}

export class LoginAttempts {
  constructor(public attemptDate: Date, public ip: string) {}
}

export class EmailConfirmType {
  constructor(
    public isConfirmed: boolean,
    public confirmationCode: string,
    public sentEmails: SentConfirmEmailType[],
  ) {}
}

export class SentConfirmEmailType {
  constructor(public sentDate: Date) {}
}

export class emailClass {
  constructor(
    public email: string,
    public message: string,
    public subject: string,
    public isSent: boolean,
    public createdAt: Date,
  ) {}
}

export class attemptsClass {
  constructor(public userIp: string, public url: string, public time: Date) {}
}

export type Paginator<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T;
};

export type Login = {
  login: string;
  password: string;
};

export type LoginSuccess = {
  token: string;
};

export type UserInput = {
  id: string;
  login: string;
};

export interface BaseAuthData {
  login: string;
  password: string;
}

export type withoutId = {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  addedAt: Date;
};

export type inputComment = {
  postId: PostsCon['id'];
  content: string;
  userId: string;
  userLogin: string;
};
