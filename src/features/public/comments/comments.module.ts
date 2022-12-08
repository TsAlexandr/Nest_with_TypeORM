// import { forwardRef, Module } from '@nestjs/common';
// import { CommentsService } from './comments.service';
// import { CommentsController } from './comments.controller';
// import { CommentsRepository } from './comments.repository';
// import { MongooseModule } from '@nestjs/mongoose';
// import { CommentsSchema } from '../common/types/schemas/schemas.model';
// import { UsersModule } from '../users/users.module';
// import { BloggersModule } from '../blogs/blogs.module';
// import { PostsModule } from '../posts/posts.module';
//
// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: 'Comments', schema: CommentsSchema }]),
//     forwardRef(() => UsersModule),
//     forwardRef(() => BloggersModule),
//     forwardRef(() => PostsModule),
//   ],
//   controllers: [CommentsController],
//   providers: [CommentsService, CommentsRepository],
// })
// export class CommentsModule {}
