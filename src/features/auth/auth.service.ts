import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';
import { v4 } from 'uuid';
import { DeviceRepository } from '../devices/device.repository';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private deviceRepository: DeviceRepository,
  ) {}

  async checkCredentials(loginBody: LoginDto, ip: string, title: string) {
    const user: any = await this.usersRepository.findByLogin(loginBody.login);
    if (!user)
      return {
        resultCode: 1,
        data: {
          accessToken: null,
          refreshToken: null,
        },
      };
    const deviceId = v4();
    const isItHash = await this._correctHash(
      loginBody.password,
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
      const tokens = await this.createTokens(user.accountData.id, deviceId);
      const payloadInfo: any = this._extractPayload(tokens.refreshToken);
      const newDevice = {
        deviceId: deviceId,
        ip: ip,
        title: title,
        lastActiveDate: new Date(payloadInfo.iat * 1000),
        expiredDate: new Date(payloadInfo.exp * 1000),
        userId: user.accountData.id,
      };
      await this.deviceRepository.addDevices(newDevice);
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

  async _extractPayload(refreshToken: string) {
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
    return payload;
  }
  async createTokens(userId: string, deviceId) {
    const accessToken = jwt.sign(
      { userId: userId },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '4h',
      },
    );
    const refreshToken = jwt.sign(
      { userId: userId, deviceId: deviceId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async validUser(loginBody: LoginDto) {
    const user: any = await this.usersRepository.findByLogin(loginBody.login);
    if (!user) return null;
    const correctPassword = await this._correctHash(
      loginBody.password,
      user.accountData.passwordHash,
    );
    if (!correctPassword) return null;
    return user;
  }

  async updateDevice(refreshToken: string) {
    const payload: any = await this._extractPayload(refreshToken);
    if (!payload) return null;
    const session = await this.deviceRepository.findDeviceById(
      payload.userId,
      payload.deviceId,
      new Date(payload.iat * 1000),
    );
    if (!session) return null;
    const tokens = await this.createTokens(payload.userId, payload.deviceId);
    const newPayloadInfo: any = await this._extractPayload(tokens.refreshToken);
    const updateDevices = await this.deviceRepository.updateDevices(
      newPayloadInfo.userId,
      newPayloadInfo.deviceId,
      new Date(newPayloadInfo.expiredDate * 1000),
      new Date(newPayloadInfo.iat * 1000),
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async removeSession(token: string) {
    const payload: any = await this._extractPayload(token);
    if (!payload) return null;
    const remove = await this.deviceRepository.removeSession(
      payload.userId,
      payload.deviceId,
    );
  }
}