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

  async getAllUsers(
    page: number,
    pageSize: number,
    searchLoginTerm: string,
    searchEmailTerm: string,
    sortBy: string,
    sortDirection: number,
  ) {
    return await this.usersRepository.getUsers(
      page,
      pageSize,
      searchLoginTerm,
      searchEmailTerm,
      sortBy,
      sortDirection,
    );
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
    const user = {
      id: v4(),
      login: registr.login,
      email: registr.email,
      passwordHash,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: v4(),
        expirationDate: new Date(),
        isConfirmed: false,
      },
      recoveryData: {
        recoveryCode: '',
        isConfirmed: false,
        expirationDate: new Date(),
      },
      banInfo: {
        isBanned: false,
        banDate: null,
        banReason: null,
      },
    };

    const createdUser = await this.usersRepository.createUser(user);
    if (createdUser) {
      const messageBody = this.emailService.getConfirmMessage(
        user.emailConfirmation.confirmationCode,
      );
      await this.emailService.sendEmail(
        user.email,
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
    if (!userCode) {
      return false;
    }
    const generatePassword = await this.authService._generateHash(
      newPasswordDto.newPassword,
    );
    const user = await this.usersRepository.confirmPassword(
      userCode.id,
      generatePassword,
    );
    if (!user) return false;
    return user;
  }

  async sendRecoveryCode(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) return true;
    const recoveryCode = v4();
    const formRecoveryCodeToMessage =
      this.emailService.getRecoveryMessage(recoveryCode);
    const recoveryData = {
      recoveryCode: recoveryCode,
      expirationDate: new Date(),
      isConfirmed: false,
    };

    const updateUser = await this.usersRepository.updateUserWithRecoveryData(
      user.id,
      recoveryData,
    );
    console.log(
      updateUser,
      'user after update information about recovery data',
    );
    if (updateUser) {
      await this.emailService.sendEmail(
        updateUser.email,
        'Your recovery code',
        formRecoveryCodeToMessage,
      );
      return;
    }
  }
}
