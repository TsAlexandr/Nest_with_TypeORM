import { InjectModel } from '@nestjs/mongoose';
import {
  Bloggers,
  BloggersDocument,
  Posts,
  PostsDocument,
} from '../common/types/schemas/schemas.model';
import { Model } from 'mongoose';
import { NewPost } from '../common/types/classes/classes';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class PostsRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectModel(Bloggers.name)
    private bloggersModel: Model<BloggersDocument>,
    @InjectModel(Posts.name) private postsModel: Model<PostsDocument>,
  ) {}
  async createPosts(createPost: Posts) {
    return await this.dataSource.query(
      `INSERT INTO "posts" VALUES ${createPost}`,
    );
  }

  async getPosts(page: number, pageSize: number, searchNameTerm: string) {
    const post = await this.dataSource.query(
      `SELECT * FROM "posts"
            WHERE "title" LIKE '%${searchNameTerm}%'
            ORDER BY "title" DESC 
            OFFSET ((${page} - 1) * ${pageSize} ROWS
            FETCH NEXT ${pageSize} ROWS ONLY)`,
    );
    const total = await this.dataSource.query(
      `SELECT COUNT(name) FROM "posts"
            WHERE "title" LIKE '%${searchNameTerm}'`,
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
            WHERE "id" LIKE ${id}`,
    );
  }

  async updatePost(
    id: string,
    bloggerId: string,
    bloggerName: string,
    updPost: NewPost,
  ) {
    const update = {
      id,
      bloggerId,
      bloggerName,
      ...updPost,
    };
    const post = await this.postsModel.updateOne(
      { id },
      { $set: { ...update } },
      { upsert: true },
    );
    return post.modifiedCount === 1;
  }

  async deletePost(id: string) {
    return await this.dataSource.query(
      `DELETE * FROM "posts"
              WHERE "id" = ${id}`,
    );
  }
}
