import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Blogger, Paginator } from '../../common/types/classes/classes';
import { BloggersDto } from '../../features/public/blogs/dto/bloggers.dto';

@Injectable()
export class BloggersRepositoryRAW {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getBloggers(
    page: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<Paginator<Blogger[]>> {
    const filter = searchNameTerm ? searchNameTerm : '';
    const bloggers = await this.dataSource.query(
      `SELECT id, name, "websiteUrl" FROM "bloggers"
            WHERE "name" LIKE $3 
            ORDER BY "name" DESC
            OFFSET $1 ROWS FETCH NEXT $2 ROWS ONLY`,
      [(page - 1) * pageSize, pageSize, '%' + filter + '%'],
    );
    const total = await this.dataSource.query(
      `SELECT COUNT(name) FROM "bloggers"
            WHERE "name" LIKE $1`,
      ['%' + filter + '%'],
    );
    const pages = Math.ceil(total[0].count / pageSize);
    return {
      pagesCount: pages,
      page: page,
      pageSize: pageSize,
      totalCount: parseInt(total[0].count),
      items: bloggers,
    };
  }

  async getBloggersById(id: string) {
    const blogger = await this.dataSource.query(
      `SELECT id, name, "websiteUrl" FROM "bloggers"
             WHERE "id" = $1`,
      [id],
    );
    return blogger[0];
  }

  async deleteBloggerById(id: string) {
    return this.dataSource.query(
      `DELETE FROM "bloggers"
            WHERE "id" = $1`,
      [id],
    );
  }

  async updateBloggerById(id: string, update: BloggersDto) {
    return this.dataSource.query(
      `UPDATE "bloggers"
            SET name = $1, "websiteUrl" = $2
            WHERE id = $3`,
      [update.name, update.websiteUrl, id],
    );
  }

  async createBlogger(newBlogger: Blogger) {
    await this.dataSource.query(
      `INSERT INTO "bloggers" ("name", "websiteUrl")
            VALUES ($1, $2)`,
      [newBlogger.name, newBlogger.websiteUrl],
    );
    const blogger = await this.dataSource.query(
      `SELECT id, name, "websiteUrl" FROM "bloggers"
             WHERE "name" = $1`,
      [newBlogger.name],
    );
    return blogger[0];
  }
}
