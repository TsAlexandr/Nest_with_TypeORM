import { Body, Controller, Post } from '@nestjs/common';
import { TelegramAdapter } from '../adapters/telegram.adapter';

@Controller('notification')
export class TelegramController {
  constructor(private telegramAdapter: TelegramAdapter) {}

  @Post('telegram')
  async getMessage(@Body() payload: any) {
    if (payload.message.text === 'Hello') {
      await this.telegramAdapter.sendMessage(
        'Hello, nice to meet you',
        payload.message.from.id,
      );
    }
    return { success: true };
  }
}
