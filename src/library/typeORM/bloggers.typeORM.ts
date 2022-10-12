import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Blogger, Paginator } from '../../common/types/classes/classes';
import { BloggersEntity } from '../../bloggers/entities/bloggers.entity';

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

  async getBloggersById(id: string) {
    const blogger = await this.dataSource
      .getRepository(BloggersEntity)
      .createQueryBuilder()
      .where('id = :id', { id })
      .getOne();
    return blogger;
  }

  async deleteBloggerById(id: string) {
    return this.dataSource
      .createQueryBuilder()
      .delete()
      .from(BloggersEntity)
      .where('id = :id', { id })
      .execute();
  }

  async updateBloggerById(id: string, name: string, youtubeUrl: string) {
    return this.dataSource
      .createQueryBuilder()
      .update(BloggersEntity)
      .set({ name: name, youtubeUrl: youtubeUrl })
      .where('id = :id', { id })
      .execute();
  }

  async createBlogger(newBlogger: Blogger) {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(BloggersEntity)
      .values([
        {
          id: newBlogger.id,
          name: newBlogger.name,
          youtubeUrl: newBlogger.youtubeUrl,
        },
      ])
      .execute();
    const blogger = await this.dataSource
      .getRepository(BloggersEntity)
      .createQueryBuilder()
      .where('name = :name', { name: newBlogger.name });
    return blogger;
  }
}
