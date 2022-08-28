import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AttemptsDocument } from '../common/types/schemas/schemas.model';

@Injectable()
export class AttemptsRepository {
  constructor(
    @InjectModel('Attempts') private attemptsModel: Model<AttemptsDocument>,
  ) {}

  async addAttempt(ip: string, url: string, time: Date) {
    const result = await this.attemptsModel.create({
      userIp: ip,
      url,
      time,
    });
    return result;
  }

  async removeOldAttempts() {
    const result = await this.attemptsModel.deleteMany({});
    return result.deletedCount;
  }

  async getLastAttempts(ip: string, url: string, attemptsTime: Date) {
    const count = await this.attemptsModel.countDocuments({
      userIp: ip,
      url,
      time: { $gt: attemptsTime },
    });
    return count;
  }
}
