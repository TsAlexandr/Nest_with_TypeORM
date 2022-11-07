import { Module } from '@nestjs/common';
import { BloggersService } from './bloggers.service';
import { BloggersController } from './bloggers.controller';
import { BloggersRepository } from './bloggers.repository';
import { PostsService } from '../posts/posts.service';
import { BloggersRepositoryORM } from '../../library/typeORM/bloggers.typeORM';
import { PostsRepository } from '../posts/posts.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BloggerSchema,
  BloggersMongo,
  Posts,
  PostsSchema,
} from '../../common/types/schemas/schemas.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Posts.name, schema: PostsSchema },
      { name: BloggersMongo.name, schema: BloggerSchema },
    ]),
  ],
  controllers: [BloggersController],
  providers: [
    BloggersService,
    PostsService,
    PostsRepository,
    BloggersRepository,
    {
      provide: 'IBlogsRepository',
      useClass: BloggersRepository,
    },
  ],
  exports: [],
})
export class BloggersModule {}
