import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getTestsApp } from './test.utility';
import {
  bloggerCreate,
  expectBlogger,
  updateTestBlogger,
  wrongBlogger,
} from './tests.mockData';

describe('App (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    app = await getTestsApp();
  });
  afterAll(async () => {
    await app.close();
  });

  describe('Bloggers', () => {
    it('/bloggers all methods', async () => {
      await request(app.getHttpServer()).del('/testing/all-data').expect(204);

      const createBlogger = await request(app.getHttpServer())
        .post('/bloggers')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(bloggerCreate)
        .expect(HttpStatus.CREATED);

      expect(createBlogger.body).toEqual(expectBlogger);

      const id = createBlogger.body.id;

      await request(app.getHttpServer())
        .post('/bloggers')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(wrongBlogger)
        .expect(HttpStatus.BAD_REQUEST);

      await request(app.getHttpServer())
        .get('/bloggers/' + id)
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .put('/bloggers/' + id)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(updateTestBlogger)
        .expect(HttpStatus.NO_CONTENT);

      await request(app.getHttpServer())
        .put('/bloggers/' + id)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(wrongBlogger)
        .expect(HttpStatus.BAD_REQUEST);

      const getBloggerAfterUpdate = await request(app.getHttpServer())
        .get('/bloggers/' + id)
        .expect(HttpStatus.OK);
      expect(getBloggerAfterUpdate.body).toEqual({
        id: id,
        name: updateTestBlogger.name,
        youtubeUrl: updateTestBlogger.youtubeUrl,
      });

      const getAll = await request(app.getHttpServer())
        .get('/bloggers')
        .query({ page: 1, pageSize: 10, searchNameTerm: '' })
        .expect(HttpStatus.OK);
      expect(getAll.body).toStrictEqual({
        page: 1,
        pageSize: 10,
        pagesCount: getAll.body.pagesCount,
        totalCount: getAll.body.totalCount,
        items: expect.any(Array),
      });
      await request(app.getHttpServer()).get('/bloggers').expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .del('/bloggers/' + id)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .expect(HttpStatus.NO_CONTENT);

      await request(app.getHttpServer())
        .del('/bloggers/' + id)
        .set('Authorization', 'Basic YWRtaW46cadslcnR5')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
  describe('Posts', () => {
    it('/posts all methods', async () => {
      const createBlogger = await request(app.getHttpServer())
        .post('/bloggers')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(bloggerCreate)
        .expect(HttpStatus.CREATED);

      expect(createBlogger.body).toEqual(expectBlogger);

      const createPostBody = {
        title: 'new title',
        shortDescription: 'new short description',
        content: 'new content for post',
        bloggerId: createBlogger.body.id,
      };

      const createPost = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send(createPostBody)
        .expect(HttpStatus.CREATED);
    });
  });
});
