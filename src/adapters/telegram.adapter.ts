import { Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');

@Injectable()
export class TelegramAdapter {
  private axiosExecutor: AxiosInstance;
  constructor() {
    const token = `5921370285:AAEI1trd_DvwALxyoMBOGZjqdWmOcsWHEwg`;
    this.axiosExecutor = axios.create({
      baseURL: `https://api.telegram.org/bot${token}/`,
    });
  }
  async sendHook(url: string) {
    await this.axiosExecutor.post(`setWebHook`, {
      url: url,
    });
  }

  async sendMessage(text: string, recipientId: number) {
    await this.axiosExecutor.post(`sendMessage`, {
      chat_id: recipientId,
      text: text,
    });
  }
}
