import { forwardRef, Module } from '@nestjs/common';
import { BloggersService } from './bloggers.service';
import { BloggersController } from './bloggers.controller';
import { BloggersRepository } from './bloggers.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BloggerSchema,
  Posts,
  PostsSchema,
} from '../common/types/schemas/schemas.model';
import { Bloggers } from '../common/types/classes/classes';
import { PostsModule } from '../posts/posts.module';
import { PostsService } from '../posts/posts.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bloggers.name, schema: BloggerSchema }]),
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
    forwardRef(() => PostsModule),
    forwardRef(() => BloggersModule),
  ],
  controllers: [BloggersController],
  providers: [BloggersService, BloggersRepository, PostsService],
  exports: [BloggersRepository],
})
export class BloggersModule {}
