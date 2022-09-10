import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthService } from '../auth/auth.service';
import { User } from '../common/types/classes/classes';
import { v4 } from 'uuid';
import { EmailService } from '../email/email.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private authService: AuthService,
    private emailService: EmailService,
  ) {}
  async getAllUsers(page: number, pageSize: number) {
    return await this.usersRepository.getUsers(page, pageSize);
  }

  async createUser(login: string, email: string, password: string) {
    const passwordHash = await this.authService._generateHash(password);
    const user: User = new User(
      {
        id: v4(),
        login: login,
        email: email,
        passwordHash: passwordHash,
        createdAt: new Date(),
      },
      {
        sentEmails: [],
        confirmationCode: v4(),
        isConfirmed: false,
      },
    );

    const createdUser = await this.usersRepository.createUser(user);
    if (createdUser) {
      const messageBody = this.emailService.getConfirmMessage(
        createdUser.emailConfirm.confirmationCode,
      );
      await this.emailService.sendEmail(
        createdUser.accountData.email,
        'Confirm your email',
        messageBody,
      );
      return createdUser;
    } else {
      return null;
    }
  }

  async deleteUser(id: string) {
    return await this.usersRepository.delUser(id);
  }

  async addToken(token: string) {
    try {
      const decode: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);
      const userToUpdate = this.usersRepository.addToken(decode.userId, token);
      return userToUpdate;
    } catch (e) {
      console.log(e);
    }
  }

  async findUserById(currentUserId: string) {
    return await this.usersRepository.findById(currentUserId);
  }
}
