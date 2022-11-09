import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthService } from '../auth/auth.service';
import { User } from '../../common/types/classes/classes';
import { v4 } from 'uuid';
import { EmailService } from '../../email/email.service';
import * as jwt from 'jsonwebtoken';
import { RegistrationDto } from '../auth/dto/registration.dto';
import { NewPasswordDto } from '../auth/dto/newPassword.dto';

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

  async createUser(registr: RegistrationDto) {
    const validEmail = await this.usersRepository.findByEmail(registr.email);
    if (validEmail)
      throw new HttpException(
        { message: [{ message: 'invalid value', field: 'email' }] },
        HttpStatus.BAD_REQUEST,
      );
    const validLogin = await this.usersRepository.findByLogin(registr.login);
    if (validLogin)
      throw new HttpException(
        { message: [{ message: 'invalid value', field: 'login' }] },
        HttpStatus.BAD_REQUEST,
      );
    const passwordHash = await this.authService._generateHash(registr.password);
    const user: User = new User(
      {
        id: v4(),
        login: registr.login,
        email: registr.email,
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
        user.emailConfirm.confirmationCode,
      );
      await this.emailService.sendEmail(
        user.accountData.email,
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

  async confirmPassword(newPasswordDto: NewPasswordDto) {
    const userCode = await this.usersRepository.findUserByCode(
      newPasswordDto.recoveryCode,
    );
    if (userCode.recoveryData.recoveryCode) {
      return false;
    }
    const generatePassword = await this.authService._generateHash(
      newPasswordDto.newPassword,
    );
    await this.usersRepository.confirmPassword(
      userCode.accountData.id,
      generatePassword,
    );
  }
}