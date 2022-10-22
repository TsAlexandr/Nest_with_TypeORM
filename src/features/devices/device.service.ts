import { DeviceRepository } from './device.repository';
import { Device } from '../../common/types/schemas/schemas.model';

export class DeviceService {
  constructor(private deviceRepository: DeviceRepository) {}

  async getDevices(userId: string) {
    const deviceForUser = await this.deviceRepository.findAllDevice(userId);
  }

  async addDevice(newDevice: Device) {
    const device = await this.deviceRepository.addDevices(newDevice);
    return device;
  }

  async deleteDevices() {
    return;
  }

  async deleteById() {
    return;
  }
}
