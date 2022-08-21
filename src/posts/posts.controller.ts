import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { NewPost } from '../classes/classes';
import { JwtExtract } from '../auth/guards/jwt.extract';
import { LocalAuthGuards } from '../auth/guards/local-auth.guards';
import { BasicGuards } from '../auth/guards/basic.guards';
import { JwtAuthGuards } from '../auth/guards/jwt-auth.guards';
import { CommentsService } from '../comments/comments.service';
import { BloggersService } from '../bloggers/bloggers.service';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private commentsService: CommentsService,
    private bloggersService: BloggersService,
  ) {}

  @UseGuards(JwtExtract)
  @Get('/')
  async getAll(
    @Query() page: number,
    @Query() pageSize: number,
    @Query() searchNameTerm: string,
    @Request() req,
  ) {
    const userId = req.user.userId || null;
    return await this.postsService.findAll(
      page,
      pageSize,
      userId,
      null,
      searchNameTerm,
    );
  }
  @UseGuards(JwtExtract)
  @Get('/:id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId || null;
    return await this.postsService.findOne(id, userId);
  }

  @UseGuards(BasicGuards)
  @Post('/')
  async create(@Body() newPost: NewPost) {
    const blogger = await this.bloggersService.getBloggerById(
      newPost.bloggerId,
    );
    const bloggerName = blogger.name;
    return await this.postsService.create(bloggerName, newPost);
  }

  @UseGuards(BasicGuards)
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() updPost: NewPost,
    @Body() bloggerId: string,
  ) {
    const blogger = await this.bloggersService.getBloggerById(bloggerId);
    const bloggerName = blogger.name;
    return await this.postsService.update(id, bloggerId, bloggerName, updPost);
  }
  @UseGuards(BasicGuards)
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return await this.postsService.remove(id);
  }

  @UseGuards(JwtExtract)
  @Get('/:postId/comments')
  async getCommentsInPages(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Param('postId') postId: string,
    @Request() req,
  ) {
    const userId = req.user.userId || null;
    return await this.commentsService.getCommentWithPage(
      postId,
      page,
      pageSize,
      userId,
    );
  }

  @UseGuards(JwtExtract)
  @Post('/:postId/comments')
  async createCommentForPost(
    @Param('postId') postId: string,
    @Body('content') content: string,
    @Request() req,
  ) {
    const login = req.user.login;
    const userId = req.user.userId;
    return await this.commentsService.createComment(
      content,
      postId,
      login,
      userId,
    );
  }

  @UseGuards(JwtAuthGuards)
  @Put('/:postId/like-status')
  async updateActions(
    @Param('postId') postId: string,
    @Body('likeStatus') likeStatus: string,
    @Request() req,
  ) {
    return await this.postsService.updateActions(likeStatus, req.user, postId);
  }
}
