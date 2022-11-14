import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtExtract } from '../auth/guards/jwt.extract';
import { DeviceService } from './device.service';
import { Cookies } from '../../common/custom-decorator/current.user.decorator';

@Controller('security')
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  @UseGuards(JwtExtract)
  @Get('/devices')
  async getDevice(@Cookies() cookies) {
    console.log(cookies);
    if (!cookies) {
      throw new HttpException(
        { message: [{ message: 'invalid value', field: 'refreshToken' }] },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const device = await this.deviceService.getDevices(cookies);
    return device;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/devices')
  async deleteAllDevice(@Cookies() cookies) {
    if (!cookies) {
      throw new HttpException(
        { message: [{ message: 'invalid value', field: 'refreshToken' }] },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const deleteDevices = await this.deviceService.deleteDevices(cookies);
    return deleteDevices;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/devices/:deviceId')
  async deleteDeviceById(
    @Param('deviceId') deviceId: string,
    @Cookies() cookies,
  ) {
    console.log(deviceId, cookies);
    const deleteDevice = await this.deviceService.deleteById(cookies, deviceId);
    return deleteDevice;
  }
}
