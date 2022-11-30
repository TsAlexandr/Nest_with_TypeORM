import { Body, Controller, Post } from '@nestjs/common';

@Controller('notification')
export class TelegramController {
  constructor() {}

  @Post('telegram')
  async getMessage(@Body() payload: any) {
    console.log(payload);
    return { success: true };
  }
}
