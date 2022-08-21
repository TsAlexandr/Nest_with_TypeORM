import { Injectable } from '@nestjs/common';
import { Bloggers } from '../schemas/schemas.model';
import { Paginator } from '../classes/classes';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { count } from 'rxjs';

@Injectable()
export class BloggersRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectModel(Bloggers.name) private bloggersModel,
  ) {}
  async getBloggers(
    page: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<Paginator<Bloggers[]>> {
    const bloggers = await this.dataSource.query(
      `SELECT * FROM "bloggers" 
            WHERE "name" LIKE '%${searchNameTerm}%'
            ORDER BY "name" DESC 
            OFFSET ((${page} - 1) * ${pageSize} ROWS
            FETCH NEXT ${pageSize} ROWS ONLY)`,
    );
    const total = await this.dataSource.query(
      `SELECT COUNT(name) FROM "bloggers"
            WHERE "name" LIKE '%${searchNameTerm}'`,
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
             WHERE "id" = ${id}`,
    );
  }

  async deleteBloggerById(id: string) {
    return this.dataSource.query(
      `DELETE * FROM "bloggers" 
            WHERE "id" = ${id}`,
    );
  }

  async updateBloggerById(id: string, name: string, youtubeUrl: string) {
    return this.dataSource.query(
      `UPDATE "bloggers" 
            SET 'name' = ${name}, 'youtubeUrl' = ${youtubeUrl} 
            WHERE 'id' = ${id}`,
    );
  }

  async createBlogger(newBlogger: Bloggers) {
    return this.dataSource.query(
      `INSERT INTO "bloggers" 
            VALUES ${newBlogger}`,
    );
  }
}
