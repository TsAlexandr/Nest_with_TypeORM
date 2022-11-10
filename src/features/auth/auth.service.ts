import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';
import { v4 } from 'uuid';
import { DeviceRepository } from '../devices/device.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private deviceRepository: DeviceRepository,
    private configService: ConfigService,
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
      console.log(payloadInfo);

      const iat = new Date(payloadInfo.iat * 1000);
      const exp = new Date(payloadInfo.exp * 1000);
      console.log(iat, 'after cast');
      const newDevice = {
        deviceId: deviceId,
        ip: ip,
        title: title,
        lastActiveDate: iat,
        expiredDate: exp,
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

  _extractPayload(refreshToken: string) {
    try {
      const secret = this.configService.get('JWT_SECRET_KEY');
      const payload = jwt.verify(refreshToken, secret);
      return payload;
    } catch (e) {
      console.log(e);
    }
  }
  async createTokens(userId: string, deviceId) {
    const secret = this.configService.get('JWT_SECRET_KEY');
    const accessToken = jwt.sign({ userId: userId }, secret, {
      expiresIn: '10s',
    });
    const refreshToken = jwt.sign(
      { userId: userId, deviceId: deviceId },
      secret,
      { expiresIn: '20s' },
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
