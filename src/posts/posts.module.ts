// import { Module } from '@nestjs/common';
// import { PostsService } from './posts.service';
// import { PostsController } from './posts.controller';
// import { PostsRepository } from './posts.repository';
// import { BloggersModule } from '../bloggers/bloggers.module';
// import { MongooseModule } from '@nestjs/mongoose';
// import {
//   Bloggers,
//   BloggerSchema,
//   Posts,
//   PostsSchema,
// } from '../schemas/schemas.model';
//
// @Module({
//   imports: [
//     BloggersModule,
//     MongooseModule.forFeature([{ name: Bloggers.name, schema: BloggerSchema }]),
//     MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
//   ],
//   controllers: [PostsController],
//   providers: [PostsService, PostsRepository],
// })
// export class PostsModule {}
