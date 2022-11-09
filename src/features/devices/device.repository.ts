import { InjectModel } from '@nestjs/mongoose';
import {
  Device,
  DeviceDocument,
} from '../../common/types/schemas/schemas.model';
import { Model } from 'mongoose';

export class DeviceRepository {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
  ) {}

  async findAllDevice(userId: string) {
    const devices = await this.deviceModel.find({ userId: userId }).lean();
    return devices;
  }

  async addDevices(newDevice: Device) {
    await this.deviceModel.create(newDevice);
    const currentDevice = await this.deviceModel.findOne({
      deviceId: newDevice.deviceId,
    });
    return {
      ip: currentDevice.ip,
      title: currentDevice.title,
      lastActiveDate: currentDevice.lastActiveDate,
      deviceId: currentDevice.deviceId,
    };
  }

  async deleteAllDevice(userId: string, deviceId: string) {
    const remove = await this.deviceModel.deleteMany({
      userId: userId,
      deviceId: { $ne: deviceId },
    });
    return remove.deletedCount === 1;
  }

  async findDeviceById(userId: string, deviceId: string, date: Date) {
    const device = await this.deviceModel
      .find({ userId: userId, deviceId: deviceId, lastActiveDate: date })
      .lean();
    return device;
  }

  async updateDevices(
    userId: string,
    deviceId: string,
    expDate: Date,
    lastActive: Date,
  ) {
    const result = await this.deviceModel.updateOne(
      { userId: userId, deviceId: deviceId },
      { $set: { expiredDate: expDate, lastActiveDate: lastActive } },
    );
    return result.matchedCount === 1;
  }

  async removeSession(userId: string, deviceId: string) {
    const result = await this.deviceModel.deleteOne({
      userId: userId,
      deviceId: deviceId,
    });
    return result.deletedCount === 1;
  }

  async getDeviceById(deviceId: string) {
    return this.deviceModel.findOne(
      { deviceId: deviceId },
      { projection: { _id: 0 } },
    );
  }

  async deleteById(userId: string, deviceId: string) {
    const result = await this.deviceModel.deleteOne({
      userId: userId,
      deviceId: deviceId,
    });
    return result.deletedCount === 1;
  }
}
