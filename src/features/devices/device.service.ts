import { DeviceRepository } from './device.repository';
import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DeviceService {
  constructor(
    private deviceRepository: DeviceRepository,
    private configService: ConfigService,
  ) {}

  async getDevices(refreshToken: string) {
    console.log(refreshToken);
    const payload: any = this._extractPayload(refreshToken.toString());
    const deviceForUser = await this.deviceRepository.findAllDevice(
      payload.userId,
    );
    return deviceForUser;
  }

  async deleteDevices(refreshToken: string) {
    const payload: any = await this._extractPayload(refreshToken);
    if (!payload)
      throw new HttpException(
        { message: [{ message: 'invalid value', field: 'refreshToken' }] },
        HttpStatus.UNAUTHORIZED,
      );
    const remove = await this.deviceRepository.deleteAllDevice(
      payload.userId,
      payload.deviceId,
    );
    return remove;
  }

  async deleteById(refreshToken: string, deviceId: string) {
    const payload: any = await this._extractPayload(refreshToken);
    if (!payload)
      throw new HttpException(
        { message: [{ message: 'invalid value', field: 'refreshToken' }] },
        HttpStatus.UNAUTHORIZED,
      );
    const device = await this.deviceRepository.getDeviceById(deviceId);
    if (!device)
      throw new HttpException(
        { message: [{ message: 'invalid value', field: 'deviceId' }] },
        HttpStatus.NOT_FOUND,
      );
    if (payload.userId !== device.userId)
      throw new HttpException(
        { message: [{ message: 'invalid value', field: 'refreshToken' }] },
        HttpStatus.FORBIDDEN,
      );
    const deleteDevice = await this.deviceRepository.deleteById(
      payload.userId,
      deviceId,
    );
    return deleteDevice;
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
