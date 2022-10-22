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
    const devices = await this.deviceModel.find({ userId });
  }

  async addDevices(newDevice: Device) {
    await this.deviceModel.create(newDevice);
    const currentDevice = await this.deviceModel.findOne({
      deviceId: newDevice.deviceId,
    });
    return currentDevice;
  }

  async deleteDevice() {
    const isDeleted = await this.deviceModel.deleteOne({});
  }
}
