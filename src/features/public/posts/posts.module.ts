// import { forwardRef, Module } from '@nestjs/common';
// import { PostsService } from './posts.service';
// import { PostsController } from './posts.controller';
// import { PostsRepository } from './posts.repository';
// import { MongooseModule } from '@nestjs/mongoose';
// import {
//   BloggerSchema,
//   CommentsSchema,
//   Posts,
//   PostsSchema,
// } from '../common/types/schemas/schemas.model';
// import { Bloggers } from '../common/types/classes/classes';
// import { CommentsModule } from '../comments/comments.module';
// import { BloggersModule } from '../blogs/blogs.module';
// import { CommentsService } from '../comments/comments.service';
// import { CommentsRepository } from '../comments/comments.repository';
// import { BlogsService } from '../blogs/blogs.service';
// import { BlogsRepository } from '../blogs/blogs.repository';
//
// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Bloggers.name, schema: BloggerSchema }]),
//     MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
//     MongooseModule.forFeature([{ name: 'Comments', schema: CommentsSchema }]),
//     forwardRef(() => CommentsModule),
//     forwardRef(() => BloggersModule),
//   ],
//   controllers: [PostsController],
//   providers: [
//     PostsService,
//     PostsRepository,
//     CommentsService,
//     CommentsRepository,
//     BlogsService,
//     BlogsRepository,
//   ],
//   exports: [PostsRepository],
// })
// export class PostsModule {}
