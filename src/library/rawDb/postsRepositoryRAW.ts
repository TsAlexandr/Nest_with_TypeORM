import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostsCon } from '../../common/types/classes/classes';

export class PostsRepositoryRAW {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createPosts(createPost) {
    await this.dataSource.query(
      `INSERT INTO "posts" 
              ("title", 
              "shortDescription", 
              "content", 
              "blogId", 
              "blogName",
              "addedAt"
            ) 
              VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        createPost.title,
        createPost.shortDescription,
        createPost.content,
        createPost.blogId,
        createPost.blogName,
        createPost.addedAt,
      ],
    );
    const post = await this.dataSource.query(
      `SELECT 
                id, 
                title, 
                "shortDescription", 
                content, 
                "blogId", 
                "blogName", 
                "addedAt"
              FROM public.posts
              WHERE title LIKE $1`,
      ['%' + createPost.title + '%'],
    );
    return {
      ...post[0],
      extendedLikesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }

  async getPosts(
    page: number,
    pageSize: number,
    userId: string,
    blogId: string,
    searchNameTerm: string,
  ) {
    const filter = searchNameTerm ? searchNameTerm : '';
    const filterByBlogger = blogId ? blogId : '';
    const post = await this.dataSource.query(
      `SELECT id, 
                title, 
                "shortDescription", 
                content, 
                "blogId", 
                "blogName", 
                "addedAt" 
            FROM "posts"
            WHERE "title" LIKE $3
            AND "blogId" LIKE $4
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
            AND "blogId" LIKE $2`,
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
                "blogId", 
                "blogName", 
                "addedAt"
              FROM "posts"
              WHERE id LIKE $1`,
      [id],
    );
    return post[0];
  }

  async updatePost(updPost: PostsCon) {
    return await this.dataSource.query(
      `UPDATE "posts"
        SET "id" = $1, "blogId" = $2,
        "blogName" =  $3, "title" = $4,
        "shortDescription" = $5, "content" = $6`,
      [
        updPost.id,
        updPost.blogId,
        updPost.blogName,
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
