import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private usersRepository: UsersRepository) {}

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

  async createTokens(userId: string) {
    const payload = { sub: userId, date: new Date() };
    const secret = process.env.JWT_SECRET_KEY || 'secret';
    const accessToken = jwt.sign(payload, secret, {
      expiresIn: '24h',
    });
    const refreshToken = jwt.sign(payload, secret, {
      expiresIn: '24h',
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}
