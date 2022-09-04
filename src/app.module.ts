import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttemptsRepository } from './attempts/attempts.repository';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DropBase, TestRepo } from './dropBaseForTests/dropBase';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BloggersModule } from './bloggers/bloggers.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import {
  Attempts,
  AttemptsSchema,
  Bloggers,
  BloggerSchema,
  CommentsSchema,
  Posts,
  PostsSchema,
  UsersSchema,
} from './common/types/schemas/schemas.model';
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
    MongooseModule.forFeature([{ name: 'Comments', schema: CommentsSchema }]),
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

    AuthModule,
    UsersModule,
    BloggersModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [AppController, DropBase],
  providers: [AttemptsRepository, AppService, TestRepo],
})
export class AppModule {}
