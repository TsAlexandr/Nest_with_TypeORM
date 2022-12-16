import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Blogger, Paginator } from '../../common/types/classes/classes';
import { BloggersEntity } from '../../features/public/blogs/entities/bloggers.entity';
import { IBlogsRepository } from '../../common/interfaces/IBlogsRepository';
import { BloggersDto } from '../../features/public/blogs/dto/bloggers.dto';

@Injectable()
export class BloggersRepositoryORM {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getBloggers(
    page: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<Paginator<BloggersEntity[]>> {
    const filter = searchNameTerm ? searchNameTerm : '';
    const bloggers = await this.dataSource
      .getRepository(BloggersEntity)
      .createQueryBuilder()
      .where('name like :filter', { filter: `%${filter}%` })
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy({ name: 'DESC' })
      .getMany();
    const total = await this.dataSource
      .getRepository(BloggersEntity)
      .createQueryBuilder()
      .getCount();
    const pages = Math.ceil(total / pageSize);
    return {
      pagesCount: pages,
      page: page,
      pageSize: pageSize,
      totalCount: total,
      items: bloggers,
    };
  }

  async getBloggersById(id: string): Promise<Blogger> {
    const blogger = await this.dataSource
      .getRepository(BloggersEntity)
      .createQueryBuilder()
      .where('id = :id', { id })
      .getOne();
    return blogger[0];
  }

  async deleteBloggerById(id: string): Promise<boolean> {
    const result = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(BloggersEntity)
      .where('id = :id', { id })
      .execute();
    if (result) return true;
  }

  async updateBloggerById(id: string, update: BloggersDto): Promise<boolean> {
    const result = await this.dataSource
      .createQueryBuilder()
      .update(BloggersEntity)
      .set({
        name: update.name,
        websiteUrl: update.websiteUrl,
        description: update.description,
      })
      .where('id = :id', { id })
      .execute();
    if (result) return true;
  }

  async createBlogger(newBlogger: Blogger): Promise<Blogger> {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(BloggersEntity)
      .values([
        {
          id: newBlogger.id,
          name: newBlogger.name,
          websiteUrl: newBlogger.websiteUrl,
          description: newBlogger.description,
          createdAt: newBlogger.createdAt,
        },
      ])
      .execute();
    const blogger = await this.dataSource
      .getRepository(BloggersEntity)
      .createQueryBuilder()
      .where('name = :name', { name: newBlogger.name });
    return blogger[0];
  }

  async bindWithUser(id: string, userId: string) {
    return;
  }
}
