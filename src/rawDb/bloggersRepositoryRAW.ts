// import { Injectable } from '@nestjs/common';
// import { Bloggers } from '../common/types/schemas/schemas.model';
// import { Paginator } from '../common/types/classes/classes';
// import { InjectDataSource } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';
// import { InjectModel } from '@nestjs/mongoose';
//
// @Injectable()
// export class BloggersRepository {
//   constructor(
//     @InjectDataSource() private dataSource: DataSource,
//     @InjectModel(Bloggers.name) private bloggersModel,
//   ) {}
//   async getBloggers(
//     page: number,
//     pageSize: number,
//     searchNameTerm: string,
//   ): Promise<Paginator<Bloggers[]>> {
//     const bloggers = await this.dataSource.query(
//       `SELECT * FROM "bloggers"
//             WHERE "name" LIKE $3
//             ORDER BY "name" DESC
//             OFFSET (($1 - 1) * $2 ROWS
//             FETCH NEXT $2 ROWS ONLY)`,
//     );
//     const total = await this.dataSource.query(
//       `SELECT COUNT(name) FROM "bloggers"
//             WHERE "name" LIKE $3`,
//     );
//     const pages = Math.ceil(total.count / pageSize);
//     return {
//       pagesCount: pages,
//       page: page,
//       pageSize: pageSize,
//       totalCount: total,
//       items: bloggers,
//     };
//   }
//
//   async getBloggersById(id: string) {
//     return this.dataSource.query(
//       `SELECT * FROM "bloggers"
//              WHERE "id" = $1`,
//     );
//   }
//
//   async deleteBloggerById(id: string) {
//     return this.dataSource.query(
//       `DELETE * FROM "bloggers"
//             WHERE "id" = $1`,
//     );
//   }
//
//   async updateBloggerById(id: string, name: string, youtubeUrl: string) {
//     return this.dataSource.query(
//       `UPDATE "bloggers"
//             SET 'name' = $2, 'youtubeUrl' = $3
//             WHERE 'id' = $1`,
//     );
//   }
//
//   async createBlogger(newBlogger: Bloggers) {
//     return this.dataSource.query(
//       `INSERT INTO "bloggers"
//             VALUES $1`,
//     );
//   }
// }
