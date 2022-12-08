// import { Module } from '@nestjs/common';
// import { BlogsService } from './blogs.service';
// import { BlogsController } from './blogs.controller';
// import { BlogsRepository } from './blogs.repository';
// import { PostsService } from '../posts/posts.service';
// import { BloggersRepositoryORM } from '../../library/typeORM/blogs.typeORM';
// import { PostsRepository } from '../posts/posts.repository';
// import { MongooseModule } from '@nestjs/mongoose';
// import {
//   BloggerSchema,
//   BloggersMongo,
//   Posts,
//   PostsSchema,
// } from '../../common/types/schemas/schemas.model';
//
// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: Posts.name, schema: PostsSchema },
//       { name: BloggersMongo.name, schema: BloggerSchema },
//     ]),
//   ],
//   controllers: [BlogsController],
//   providers: [
//     BlogsService,
//     PostsService,
//     PostsRepository,
//     BlogsRepository,
//     {
//       provide: 'IBlogsRepository',
//       useClass: BlogsRepository,
//     },
//   ],
//   exports: [],
// })
// export class BloggersModule {}
