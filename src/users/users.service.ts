import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthService } from '../auth/auth.service';
import { User } from '../classes/classes';
import { v4 } from 'uuid';
import { TemplateService } from '../email/template.service';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'nodemailer/lib/xoauth2';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private authService: AuthService,
    private templateService: TemplateService,
    private emailService: EmailService,
    private jwtService: JwtService,
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
      [],
      {
        sentEmails: [],
        confirmationCode: v4(),
        isConfirmed: false,
      },
    );

    const createdUser = await this.usersRepository.createUser(user);
    if (createdUser) {
      const messageBody = this.templateService.getConfirmMessage(
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
      const decode: any = this.jwtService.verifyAsync<Token>(token);
      const userToUpdate = this.usersRepository.addToken(decode.userId, token);
      return userToUpdate;
    } catch (e) {
      console.log(e);
    }
  }
}
