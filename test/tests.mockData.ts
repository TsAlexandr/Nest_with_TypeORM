import { BloggersDto } from '../src/bloggers/dto/bloggers.dto';

export const bloggerCreate: BloggersDto = {
  name: 'hello blogger',
  youtubeUrl: 'https://youtubadsfadsg.com',
};

export const expectBlogger = {
  id: expect.any(String),
  name: bloggerCreate.name,
  youtubeUrl: bloggerCreate.youtubeUrl,
};

export const wrongBlogger = {
  name: 1234,
  youtubeUrl: 'blablablabla',
};

export const updateTestBlogger = {
  name: 'hello',
  youtubeUrl: 'https://youtube.com',
};
