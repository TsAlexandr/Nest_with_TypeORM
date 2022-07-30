import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async checkCredentials(login: string, password: string) {
    const user: any = await this.usersRepository.findByLogin(login);
    if (!user)
      return {
        resultCode: 1,
        data: {
          accessToken: null,
          refreshToken: null,
        },
      };
    const isItHash = await this._correctHash(
      password,
      user.accountData.passwordHash,
    );
    if (!isItHash) {
      return {
        resultCode: 1,
        data: {
          accessToken: null,
          refreshToken: null,
        },
      };
    } else {
      const tokens = await this.createTokens(user.accountData.id);
      return {
        resultCode: 0,
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      };
    }
  }

  async _generateHash(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async _correctHash(password: string, hash: string) {
    const equal = await bcrypt.compare(password, hash);
    return equal;
  }

  decodeBaseAuth(token: string) {
    const buff = Buffer.from(token, 'base64');

    const decodedString = buff.toString('ascii');

    const loginAndPassword = decodedString.split(':');
    return {
      login: loginAndPassword[0],
      password: loginAndPassword[1],
    };
  }

  async createTokens(userId: string) {
    const payload = { userId, date: new Date() };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload);
    return {
      accessToken,
      refreshToken,
    };
  }
}
