import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostsCon } from '../../common/types/classes/classes';

export class PostsRepositoryRAW {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async createPosts(createPost: PostsCon) {
    await this.dataSource.query(
      `INSERT INTO "posts" 
              ("title", 
              "shortDescription", 
              "content", 
              "bloggerId", 
              "bloggerName") 
              VALUES ($1, $2, $3, $4, $5)`,
      [
        createPost.title,
        createPost.shortDescription,
        createPost.content,
        createPost.bloggerId,
        createPost.bloggerName,
      ],
    );
    const post = await this.dataSource.query(
      `SELECT 
                id, 
                title, 
                "shortDescription", 
                content, 
                "bloggerId", 
                "bloggerName", 
                "addedAt"
              FROM public.posts
              WHERE title LIKE $3`,
      ['%' + createPost.title + '%'],
    );
    return post[0];
  }

  async getPosts(
    page: number,
    pageSize: number,
    userId: string,
    bloggerId: string,
    searchNameTerm: string,
  ) {
    const filter = searchNameTerm ? searchNameTerm : '';
    const filterByBlogger = bloggerId ? bloggerId : '';
    const post = await this.dataSource.query(
      `SELECT * FROM "posts"
            WHERE "title" LIKE $3
            AND "bloggerId" LIKE $4
            ORDER BY "title" DESC
            OFFSET $1 ROWS
            FETCH NEXT $2 ROWS ONLY`,
      [
        (page - 1) * pageSize,
        pageSize,
        '%' + filter + '%',
        '%' + filterByBlogger + '%',
      ],
    );
    const total = await this.dataSource.query(
      `SELECT COUNT(name) FROM "posts"
            WHERE "title" LIKE $1
            AND "bloggerId" LIKE $2`,
      ['%' + filter + '%', '%' + filterByBlogger + '%'],
    );
    const pages = Math.ceil(total.count / pageSize);
    return {
      pagesCount: pages,
      page: page,
      pageSize: pageSize,
      totalCount: parseInt(total[0].count),
      items: post,
    };
  }

  async getPostById(id: string, userId: string) {
    const post = await this.dataSource.query(
      `SELECT 
                id, 
                title, 
                "shortDescription", 
                content, 
                "bloggerId", 
                "bloggerName", 
                "addedAt",
              FROM public.posts
              WHERE "id" LIKE $1`,
      [id],
    );
    return post[0];
  }

  async updatePost(updPost: PostsCon) {
    return await this.dataSource.query(
      `UPDATE "posts"
        SET "id" = $1, "bloggerId" = $2,
        "bloggerName" =  $3, "title" = $4,
        "shortDescription" = $5, "content" = $6`,
      [
        updPost.id,
        updPost.bloggerId,
        updPost.bloggerName,
        updPost.title,
        updPost.shortDescription,
        updPost.content,
      ],
    );
  }

  async deletePost(id: string) {
    return await this.dataSource.query(
      `DELETE FROM "posts"
              WHERE "id" = $1`,
      [id],
    );
  }

  async updateActions(
    postId: string,
    likeStatus: string,
    userId: string,
    login: string,
  ) {
    const addedAt = new Date();
    return Promise.resolve(undefined);
  }
}
