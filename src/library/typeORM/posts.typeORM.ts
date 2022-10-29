import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { NewPost } from '../../common/types/classes/classes';
import { Posts } from '../../common/types/schemas/schemas.model';
import { PostEntity } from '../../features/posts/entities/post.entity';

export class PostsTypeORM {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createPosts(createPost: Posts) {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(PostEntity)
      .values([
        {
          id: createPost.id,
          title: createPost.title,
          content: createPost.content,
          shortDescription: createPost.shortDescription,
          addedAt: createPost.addedAt,
          blogId: createPost.blogId,
          blogName: createPost.blogName,
        },
      ])
      .execute();
    const post = await this.dataSource
      .getRepository(PostEntity)
      .createQueryBuilder()
      .where('id = :id', { id: createPost.id });
    return post;
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
    const post = await this.dataSource
      .getRepository(PostEntity)
      .createQueryBuilder()
      .where('id = :id', { id });
    return post;
  }

  async updatePost(
    id: string,
    blogId: string,
    blogName: string,
    updPost: NewPost,
  ) {
    return this.dataSource
      .createQueryBuilder()
      .update(PostEntity)
      .set({
        blogId: blogId,
        blogName: blogName,
        title: updPost.title,
        shortDescription: updPost.shortDescription,
        content: updPost.content,
      })
      .where('id = :id', { id })
      .execute();
  }

  async deletePost(id: string) {
    return this.dataSource
      .createQueryBuilder()
      .delete()
      .from(PostEntity)
      .where('id = :id', { id })
      .execute();
  }
}

// async createPosts(postsNew: postsType): Promise<postsType> {
//   const post = new Posts();
//   post.id = postsNew.id;
//   post.title = postsNew.title;
//   post.shortDescription = postsNew.shortDescription;
//   post.content = postsNew.content;
//   post.addedAt = postsNew.addedAt;
//
//   const blogger = await this.dataSource.getRepository(Bloggers).findOne({
//     where: {
//       id: postsNew.bloggerId,
//     },
//   });
//   post.blogger = blogger;
//
//   const postEntity = await this.dataSource.getRepository(Posts).save(post);
//
//   return postsNew;
