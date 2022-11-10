import { DeviceRepository } from './device.repository';
import * as jwt from 'jsonwebtoken';
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class DeviceService {
  constructor(
    private deviceRepository: DeviceRepository,
    private configService: ConfigService,
  ) {}

  async getDevices(refreshToken: string) {
    const payload: any = await this._extractPayload(refreshToken);
    const deviceForUser = await this.deviceRepository.findAllDevice(
      payload.userId,
    );
    return deviceForUser;
  }

  async deleteDevices(refreshToken: string) {
    const payload: any = await this._extractPayload(refreshToken);
    if (!payload) throw new UnauthorizedException();
    const remove = await this.deviceRepository.deleteAllDevice(
      payload.userId,
      payload.deviceId,
    );
    return remove;
  }

  async deleteById(refreshToken: string, deviceId: string) {
    const payload: any = await this._extractPayload(refreshToken);
    if (!payload) throw new UnauthorizedException();
    const device = await this.deviceRepository.getDeviceById(deviceId);
    if (!device) throw new NotFoundException();
    if (payload.userId !== device.userId) throw new ForbiddenException();
    const deleteDevice = await this.deviceRepository.deleteById(
      payload.userId,
      deviceId,
    );
    return deleteDevice;
  }

  async _extractPayload(refreshToken: string) {
    try {
      // const secret = this.configService.get('JWT_SECRET_KEY');
      const payload = jwt.verify(
        refreshToken,
        this.configService.get('JWT_SECRET_KEY'),
      );
      return payload;
    } catch (e) {
      console.log(e);
    }
  }
}
