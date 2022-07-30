// import { Model } from 'mongoose';
// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Bloggers } from '../schemas/schemas.model';
// import { Paginator } from '../classes/classes';
//
// @Injectable()
// export class BloggersRepository {
//   constructor(@InjectDataSource() private dataSource: DataSource) {}
//   async getBloggers(
//     page: number,
//     pageSize: number,
//     searchNameTerm: string,
//   ): Promise<Paginator<Bloggers[]>> {
//     const filter = { name: { $regex: searchNameTerm ? searchNameTerm : '' } };
//     const bloggers = await this.bloggersModel
//       .find(filter, { projection: { _id: 0 } })
//       .skip((page - 1) * pageSize)
//       .limit(pageSize)
//       .lean();
//
//     const count = await this.bloggersModel.countDocuments(filter);
//     const total = Math.ceil(count / pageSize);
//
//     return {
//       pagesCount: total,
//       page: page,
//       pageSize: pageSize,
//       totalCount: count,
//       items: bloggers,
//     };
//   }
//
//   async getBloggersById(id: string) {
//     return this.dataSource.query(`SELECT * FROM "bloggers" WHERE "id" = ${id}`);
//   }
//
//   async deleteBloggerById(id: string) {
//     return this.dataSource.query(`DELETE * FROM 'bloggers' WHERE "id" = ${id}`);
//   }
//
//   async updateBloggerById(id: string, name: string, youtubeUrl: string) {
//     return this.dataSource.query(
//       `UPDATE 'bloggers' SET 'name' = ${name}, 'youtubeUrl' = ${youtubeUrl} WHERE 'id' = ${id}`,
//     );
//   }
//
//   async createBlogger(newBlogger: Bloggers) {
//     return this.dataSource.query(`INSERT INTO 'bloggers' VALUES ${newBlogger}`);
//   }
// }
