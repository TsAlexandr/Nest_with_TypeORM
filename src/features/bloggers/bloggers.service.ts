import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { BloggersDto } from './dto/bloggers.dto';
import { IBlogsRepository } from '../../common/interfaces/IBlogsRepository';

@Injectable()
export class BloggersService {
  constructor(
    @Inject('IBlogsRepository')
    private bloggersRepository: IBlogsRepository,
  ) {}

  async getBloggers(
    page: number,
    pageSize: number,
    searchNameTerm: string,
    sortBy: string,
    sortDirection: number,
  ) {
    return await this.bloggersRepository.getBloggers(
      page,
      pageSize,
      searchNameTerm,
      sortBy,
      sortDirection,
    );
  }

  async getBloggerById(id: string) {
    return await this.bloggersRepository.getBloggersById(id);
  }

  async createBlogger(bloggersDto: BloggersDto) {
    const newBlogger = {
      id: uuidv4(),
      ...bloggersDto,
      createdAt: new Date().toISOString(),
    };
    return await this.bloggersRepository.createBlogger(newBlogger);
  }

  async updateBlogger(id: string, update: BloggersDto) {
    return await this.bloggersRepository.updateBloggerById(id, update);
  }

  async deleteBlogger(id: string): Promise<boolean> {
    return await this.bloggersRepository.deleteBloggerById(id);
  }
}
