import { InjectModel } from '@nestjs/mongoose';
import { TotalActions } from '../common/types/classes/classes';

export class LikesRepository {
  constructor(@InjectModel('Actions') private actionsModel) {}
  async updateLikeStatus(newAction: TotalActions) {
    const action = await this.actionsModel.create(newAction);
    return null;
  }

  async getLikes(postId: string) {
    const likes = await this.actionsModel
      .find({ postId }, { _id: false, __v: false })
      .lean();
    return likes;
  }
}
