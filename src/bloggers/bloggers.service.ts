import { Injectable } from '@nestjs/common';
import { BloggersRepository } from './bloggers.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BloggersService {
  constructor(private bloggersRepository: BloggersRepository) {}
  async getBloggers(page: number, pageSize: number, searchNameTerm: string) {
    return await this.bloggersRepository.getBloggers(
      page,
      pageSize,
      searchNameTerm,
    );
  }

  async getBloggerById(id: string) {
    return await this.bloggersRepository.getBloggersById(id);
  }

  async createBlogger(name: string, youtubeUrl: string) {
    const newBlogger = {
      id: uuidv4(),
      name: name,
      youtubeUrl: youtubeUrl,
    };
    return await this.bloggersRepository.createBlogger(newBlogger);
  }

  async updateBlogger(id: string, name: string, youtubeUrl: string) {
    return await this.bloggersRepository.updateBloggerById(
      id,
      name,
      youtubeUrl,
    );
  }

  async deleteBlogger(id: string) {
    return await this.bloggersRepository.deleteBloggerById(id);
  }
}
