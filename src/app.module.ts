import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttemptsRepository } from './attempts/attempts.repository';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DropBase, TestRepo } from './dropBaseForTests/dropBase';
import {
  Attempts,
  AttemptsSchema,
  Bloggers,
  BloggerSchema,
  Comments,
  CommentsSchema,
  Posts,
  PostsSchema,
  UsersSchema,
} from './common/types/schemas/schemas.model';
import { PostsController } from './posts/posts.controller';
import { BloggersController } from './bloggers/bloggers.controller';
import { UsersController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';
import { CommentsController } from './comments/comments.controller';
import { BloggersRepository } from './bloggers/bloggers.repository';
import { CommentsRepository } from './comments/comments.repository';
import { UsersService } from './users/users.service';
import { ExistingPostGuard } from './auth/guards/existingPostGuard';
import { JwtExtractStrategy } from './auth/strategies/jwt.extract.strategy';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { JwtExtract } from './auth/guards/jwt.extract';
import { JwtAuthGuards } from './auth/guards/jwt-auth.guards';
import { LocalAuthGuards } from './auth/guards/local-auth.guards';
import { UsersRepository } from './users/users.repository';
import { BasicGuards } from './auth/guards/basic.guards';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { BloggersService } from './bloggers/bloggers.service';
import { PostsService } from './posts/posts.service';
import { CommentsService } from './comments/comments.service';
import { PostsRepository } from './posts/posts.repository';
import { AuthService } from './auth/auth.service';
import { EmailService } from './email/email.service';
import { UserExistGuard } from './auth/guards/userExistGuard';
import { LikesService } from './actions/likes.service';
import { LikesRepository } from './actions/likes.repository';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(
      'mongodb+srv://hello:rerere@cluster0.rxylv.mongodb.net/Cluster0?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      { name: Attempts.name, schema: AttemptsSchema },
    ]),
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: Bloggers.name, schema: BloggerSchema }]),
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'ec2-3-208-79-113.compute-1.amazonaws.com',
    //   port: 5432,
    //   username: process.env.USERNAME,
    //   password: process.env.PASS,
    //   database: 'd2116gcujm4m2k',
    //   autoLoadEntities: true,
    //   synchronize: false,
    //   ssl: { rejectUnauthorized: false },
    // }),
  ],
  controllers: [
    AppController,
    BloggersController,
    PostsController,
    CommentsController,
    UsersController,
    AuthController,
    DropBase,
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
    AppService,
    JwtExtractStrategy,
    JwtStrategy,
    LocalStrategy,
    JwtAuthGuards,
    BasicGuards,
    LocalAuthGuards,
    TestRepo,
    ExistingPostGuard,
    UserExistGuard,
    JwtExtract,
  ],
})
export class AppModule {}
