import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { NewPost } from '../classes/classes';
import { v4 } from 'uuid';
import { BloggersRepository } from '../bloggers/bloggers.repository';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private bloggersRepository: BloggersRepository,
  ) {}
  async create(bloggerId: string, newPost: NewPost) {
    const blogger = this.bloggersRepository.getBloggersById(bloggerId);
    if (!blogger) {
      return false;
    } else {
      const createPost = {
        ...newPost,
        id: v4(),
        bloggerId: bloggerId,
      };
      return await this.postsRepository.createPosts(createPost);
    }
  }

  async findAll(page: number, pageSize: number) {
    return await this.postsRepository.getPosts(page, pageSize);
  }

  async findOne(id: string) {
    return await this.postsRepository.getPostById(id);
  }

  async update(id: string, bloggerId: string, updPost: NewPost) {
    const blogger = await this.bloggersRepository.getBloggersById(bloggerId);
    if (!blogger) {
      return false;
    } else {
      const bloggerName = blogger.name;
      return await this.postsRepository.updatePost(
        id,
        bloggerId,
        bloggerName,
        updPost,
      );
    }
  }

  async remove(id: string) {
    return await this.postsRepository.deletePost(id);
  }

  async getPostsInPages(bloggerId: string, page: number, pageSize: number) {
    const post = await this.postsRepository.getPostInPages(
      bloggerId,
      page,
      pageSize,
    );
    return post;
  }
}
