import { Injectable } from '@nestjs/common';
import { BloggersRepository } from './bloggers.repository';
import { v4 as uuidv4 } from 'uuid';
import { BloggersDto } from './dto/bloggers.dto';
import { BloggersRepositoryRAW } from '../library/rawDb/bloggersRepositoryRAW';

@Injectable()
export class BloggersService {
  constructor(private bloggersRepository: BloggersRepositoryRAW) {}
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

  async createBlogger(bloggersDto: BloggersDto) {
    const newBlogger = {
      id: uuidv4(),
      ...bloggersDto,
    };
    return await this.bloggersRepository.createBlogger(newBlogger);
  }

  async updateBlogger(id: string, update: BloggersDto) {
    return await this.bloggersRepository.updateBloggerById(id, update);
  }

  async deleteBlogger(id: string) {
    return await this.bloggersRepository.deleteBloggerById(id);
  }
}
