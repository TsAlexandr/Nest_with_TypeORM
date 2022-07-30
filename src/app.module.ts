import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users/users.controller';
import { BloggersController } from './bloggers/bloggers.controller';
import { PostsController } from './posts/posts.controller';
import { CommentsController } from './comments/comments.controller';
import { BloggersService } from './bloggers/bloggers.service';
import { PostsService } from './posts/posts.service';
import { CommentsService } from './comments/comments.service';
import { UsersService } from './users/users.service';
import { BloggersRepository } from './bloggers/bloggers.repository';
import { PostsRepository } from './posts/posts.repository';
import { CommentsRepository } from './comments/comments.repository';
import { UsersRepository } from './users/users.repository';
import { AuthService } from './auth/auth.service';
import { EmailService } from './email/email.service';
import { AttemptsRepository } from './attempts/attempts.repository';
import { AppController } from './app.controller';
import { JwtService } from '@nestjs/jwt';
import {
  AttemptsSchema,
  BloggerSchema,
  CommentsSchema,
  PostsSchema,
  UsersSchema,
} from './schemas/schemas.model';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://hello:rerere@cluster0.rxylv.mongodb.net/Cluster0?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([{ name: 'Bloggers', schema: BloggerSchema }]),
    MongooseModule.forFeature([{ name: 'Posts', schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentsSchema }]),
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: 'Attempts', schema: AttemptsSchema }]),
  ],
  controllers: [
    AppController,
    BloggersController,
    PostsController,
    CommentsController,
    UsersController,
  ],
  providers: [
    BloggersService,
    PostsService,
    CommentsService,
    UsersService,
    BloggersRepository,
    PostsRepository,
    CommentsRepository,
    UsersRepository,
    AuthService,
    EmailService,
    AttemptsRepository,
    JwtService,
    AppService,
  ],
})
export class AppModule {}
