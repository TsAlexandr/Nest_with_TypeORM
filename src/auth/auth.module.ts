// import { forwardRef, Module } from '@nestjs/common';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { LocalStrategy } from './strategies/local.strategy';
// import { JwtAuthGuards } from './guards/jwt-auth.guards';
// import { UsersModule } from '../users/users.module';
// import { JwtExtractStrategy } from './strategies/jwt.extract.strategy';
// import { JwtStrategy } from './strategies/jwt.strategy';
// import { BasicGuards } from './guards/basic.guards';
// import { LocalAuthGuards } from './guards/local-auth.guards';
// import { ExistingPostGuard } from './guards/existingPostGuard';
// import { UserExistGuard } from './guards/userExistGuard';
// import { JwtExtract } from './guards/jwt.extract';
// import { PostsModule } from '../posts/posts.module';
// import { PostsService } from '../posts/posts.service';
// import { UsersService } from '../users/users.service';
// import { PostsRepository } from '../posts/posts.repository';
// import { EmailService } from '../email/email.service';
// import { BloggersModule } from '../bloggers/bloggers.module';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Bloggers } from '../common/types/classes/classes';
// import {
//   BloggerSchema,
//   Posts,
//   PostsSchema,
// } from '../common/types/schemas/schemas.model';
//
// @Module({
//   imports: [
//     forwardRef(() => UsersModule),
//     forwardRef(() => PostsModule),
//     EmailService,
//     MongooseModule.forFeature([{ name: Bloggers.name, schema: BloggerSchema }]),
//     MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
//   ],
//   controllers: [AuthController],
//   providers: [
//     AuthService,
//     LocalStrategy,
//     JwtAuthGuards,
//     JwtExtractStrategy,
//     JwtStrategy,
//     BasicGuards,
//     LocalAuthGuards,
//     ExistingPostGuard,
//     UserExistGuard,
//     JwtExtract,
//     PostsService,
//     UsersService,
//     PostsRepository,
//     EmailService,
//   ],
//   exports: [AuthService],
// })
// export class AuthModule {}
