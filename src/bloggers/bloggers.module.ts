import { forwardRef, Module } from '@nestjs/common';
import { BloggersService } from './bloggers.service';
import { BloggersController } from './bloggers.controller';
import { BloggersRepository } from './bloggers.repository';
import { AppModule } from '../app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Bloggers } from '../schemas/schemas.model';

@Module({
  controllers: [BloggersController],
  providers: [BloggersService, BloggersRepository],
  imports: [
    forwardRef(() => AppModule),
    MongooseModule.forFeature([{ name: Bloggers.name, schema: Bloggers }]),
  ],
})
export class BloggersModule {}
