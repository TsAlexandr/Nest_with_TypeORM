import { DeviceRepository } from './device.repository';
import { Device } from '../../common/types/schemas/schemas.model';
import * as jwt from 'jsonwebtoken';
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class DeviceService {
  constructor(private deviceRepository: DeviceRepository) {}

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
    const payload: any = jwt.verify(refreshToken, process.env.JWT_SECRET);
    return payload;
  }
}
