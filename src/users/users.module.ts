import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from '../common/types/schemas/schemas.model';
import { AuthModule } from '../auth/auth.module';
import { EmailService } from '../email/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
    forwardRef(() => AuthModule),
    EmailService,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, EmailService],
  exports: [UsersRepository],
})
export class UsersModule {}
