import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Blogger, Paginator } from '../../common/types/classes/classes';
import { BloggersDto } from '../../bloggers/dto/bloggers.dto';

@Injectable()
export class BloggersRepositoryRAW {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async getBloggers(
    page: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<Paginator<Blogger[]>> {
    const bloggers = await this.dataSource.query(
      `SELECT * FROM "bloggers"
            WHERE "name" LIKE $3
            ORDER BY "name" DESC
            OFFSET ($1 ROWS
            FETCH NEXT $2 ROWS ONLY)`,
      [(page - 1) * pageSize, pageSize, '%' + searchNameTerm + '%'],
    );
    const total = await this.dataSource.query(
      `SELECT COUNT(name) FROM "bloggers"
            WHERE "name" LIKE $1`,
      ['%' + searchNameTerm + '%'],
    );
    const pages = Math.ceil(total.count / pageSize);
    return {
      pagesCount: pages,
      page: page,
      pageSize: pageSize,
      totalCount: total,
      items: bloggers,
    };
  }

  async getBloggersById(id: string) {
    return this.dataSource.query(
      `SELECT * FROM "bloggers"
             WHERE "id" = $1`,
      [id],
    );
  }

  async deleteBloggerById(id: string) {
    return this.dataSource.query(
      `DELETE * FROM "bloggers"
            WHERE "id" = $1`,
      [id],
    );
  }

  async updateBloggerById(id: string, update: BloggersDto) {
    return this.dataSource.query(
      `UPDATE "bloggers"
            SET 'name' = $1, 'youtubeUrl' = $2
            WHERE 'id' = $3`,
      [update.name, update.youtubeUrl, id],
    );
  }

  async createBlogger(newBlogger: Blogger) {
    return await this.dataSource.query(
      `INSERT INTO "bloggers" ("name", "youtubeUrl")
            VALUES ($1, $2)`,
      [newBlogger.name, newBlogger.youtubeUrl],
    );
  }
}