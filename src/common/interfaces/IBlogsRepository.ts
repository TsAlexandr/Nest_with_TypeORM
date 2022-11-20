import { BloggersDto } from '../../features/bloggers/dto/bloggers.dto';
import { Blogger, Paginator } from '../types/classes/classes';

export interface IBlogsRepository {
  getBloggers(
    page: number,
    pageSize: number,
    searchNameTerm: string,
    sortBy: string,
    sortDirection: number,
  ): Promise<Paginator<Blogger[]>>;

  getBloggersById(id: string): Promise<Blogger>;

  createBlogger(newBlogger: {
    websiteUrl: string;
    name: string;
    id: string;
  }): Promise<Blogger>;

  updateBloggerById(id: string, update: BloggersDto): Promise<boolean>;

  deleteBloggerById(id: string): Promise<boolean>;
}
