import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Paginator } from '../../common/types/classes/classes';
import { Bloggers } from '../../bloggers/entities/bloggers.entity';

@Injectable()
export class BloggersTypeORM {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async getBloggers(
    page: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<Paginator<Bloggers[]>> {
    const bloggers = await this.dataSource.query(
      `SELECT * FROM "bloggers"
            WHERE "name" LIKE $3
            ORDER BY "name" DESC
            OFFSET ($1 ROWS
            FETCH NEXT $2 ROWS ONLY)`,
      [(page - 1) * pageSize, pageSize, searchNameTerm],
    );
    const total = await this.dataSource.query(
      `SELECT COUNT(name) FROM "bloggers"
            WHERE "name" LIKE $1`,
      [searchNameTerm],
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

  async updateBloggerById(id: string, name: string, youtubeUrl: string) {
    return this.dataSource.query(
      `UPDATE "bloggers"
            SET 'name' = $2, 'youtubeUrl' = $3
            WHERE 'id' = $1`,
      [id, name, youtubeUrl],
    );
  }

  async createBlogger(newBlogger: Bloggers) {
    return this.dataSource.query(
      `INSERT INTO "bloggers"
            VALUES $1`,
      [newBlogger],
    );
  }
}
