import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtExtract } from '../auth/guards/jwt.extract';
import { DeviceService } from './device.service';

@Controller('security')
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  @UseGuards(JwtExtract)
  @Get('/devices')
  async getDevice(@Req() req) {
    const device = await this.deviceService.getDevices();
    return device;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/devices')
  async deleteAllDevice() {
    return;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/devices/:deviceId')
  async deleteDeviceById() {
    return;
  }
}
