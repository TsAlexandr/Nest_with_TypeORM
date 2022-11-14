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

      const iat = new Date(payloadInfo.iat * 1000);
      const exp = new Date(payloadInfo.exp * 1000);
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

  async createTokens(userId: string, deviceId) {
    const secret = this.configService.get('JWT_SECRET_KEY');
    const accessToken = jwt.sign({ userId: userId }, secret, {
      expiresIn: '1h',
    });
    const refreshToken = jwt.sign(
      { userId: userId, deviceId: deviceId },
      secret,
      { expiresIn: '2h' },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateDevice(refreshToken: string) {
    const payload: any = this._extractPayload(refreshToken);
    console.log(payload, 'from refresh token when we wanna get a new pair');
    if (!payload) return null;
    const iat = new Date(payload.iat * 1000);
    const session = await this.deviceRepository.findDeviceById(
      payload.userId,
      payload.deviceId,
      iat,
    );
    if (!session) return null;
    const tokens = await this.createTokens(payload.userId, payload.deviceId);
    const newPayloadInfo: any = this._extractPayload(tokens.refreshToken);
    console.log(
      newPayloadInfo,
      'new payload info after getting new pair tokens',
    );
    const newIat = new Date(newPayloadInfo.iat * 1000);
    const newExp = new Date(newPayloadInfo.exp * 1000);
    await this.deviceRepository.updateDevices(
      newPayloadInfo.userId,
      newPayloadInfo.deviceId,
      newExp,
      newIat,
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async removeSession(token: string) {
    const payload: any = this._extractPayload(token);
    if (!payload) return null;
    const remove = await this.deviceRepository.removeSession(
      payload.userId,
      payload.deviceId,
    );
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
}
