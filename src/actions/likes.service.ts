import { LikesRepository } from './likes.repository';

export class LikesService {
  constructor(private likesRepository: LikesRepository) {}
  async getLikes(postId: string) {
    return await this.likesRepository.getLikes(postId);
  }

  async updateLikes(
    postId: string,
    likeStatus: string,
    userId: string,
    login: string,
    addedAt: Date,
  ) {
    const newLikes = {
      postId,
      action: likeStatus,
      userId,
      login,
      addedAt,
    };
    return await this.likesRepository.updateLikeStatus(newLikes);
  }
}
