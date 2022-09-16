import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { NewPost } from '../../common/types/classes/classes';
import { Posts } from '../../common/types/schemas/schemas.model';

export class PostsTypeORM {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async createPosts(createPost: Posts) {
    return await this.dataSource.query(`INSERT INTO "posts" VALUES $1`, [
      createPost,
    ]);
  }

  async getPosts(page: number, pageSize: number, searchNameTerm: string) {
    const post = await this.dataSource.query(
      `SELECT * FROM "posts"
            WHERE "title" LIKE $3
            ORDER BY "title" DESC
            OFFSET ($1 ROWS
            FETCH NEXT $2 ROWS ONLY)`,
      [(page - 1) * pageSize, pageSize, searchNameTerm],
    );
    const total = await this.dataSource.query(
      `SELECT COUNT(name) FROM "posts"
            WHERE "title" LIKE $1`,
      [searchNameTerm],
    );
    const pages = Math.ceil(total.count / pageSize);
    return {
      pagesCount: pages,
      page: page,
      pageSize: pageSize,
      totalCount: total,
      items: post,
    };
  }

  async getPostById(id: string) {
    return await this.dataSource.query(
      `SELECT * FROM "posts"
            WHERE "id" LIKE $1`,
      [id],
    );
  }

  async updatePost(
    id: string,
    bloggerId: string,
    bloggerName: string,
    updPost: NewPost,
  ) {
    const post = await this.dataSource.query(
      `UPDATE "posts"
        SET "id" = $1, "bloggerId" = $2,
        "bloggerName" =  $3, "title" = $4,
        "shortDescription" = $5, "content" = $6`,
      [
        id,
        bloggerId,
        bloggerName,
        updPost.title,
        updPost.shortDescription,
        updPost.content,
      ],
    );
  }

  async deletePost(id: string) {
    return await this.dataSource.query(
      `DELETE * FROM "posts"
              WHERE "id" = $1`,
      [id],
    );
  }
}
