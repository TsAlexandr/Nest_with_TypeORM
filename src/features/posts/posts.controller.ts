import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Req,
  UseGuards,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Actions } from '../../common/types/classes/classes';
import { JwtExtract } from '../auth/guards/jwt.extract';
import { BasicGuards } from '../auth/guards/basic.guards';
import { JwtAuthGuards } from '../auth/guards/jwt-auth.guards';
import { CommentsService } from '../comments/comments.service';
import { ExistingPostGuard } from '../auth/guards/existingPostGuard';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersService } from '../users/users.service';
import { Pagination } from '../../common/types/classes/pagination';
import { BloggersService } from '../bloggers/bloggers.service';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private commentsService: CommentsService,
    private usersService: UsersService,
    private bloggersService: BloggersService,
  ) {}

  @UseGuards(JwtExtract)
  @Get()
  async getAll(@Query() query, @Req() req) {
    const { page, pageSize, searchNameTerm, sortBy, sortDirection } =
      Pagination.getPaginationData(query);
    const userId = req.user.userId || null;
    const posts = await this.postsService.findAll(
      page,
      pageSize,
      userId,
      null,
      searchNameTerm,
      sortBy,
      sortDirection,
    );
    return posts;
  }

  @UseGuards(JwtExtract)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const userId: string = req.user.userId || null;
    const post = await this.postsService.findOne(id, userId);
    return post;
  }

  @UseGuards(BasicGuards)
  @Post()
  async create(@Body() newPost: CreatePostDto) {
    const blogger = await this.bloggersService.getBloggerById(newPost.blogId);
    if (!blogger)
      throw new HttpException(
        { message: [{ message: 'invalid value', field: 'likeStatus' }] },
        HttpStatus.BAD_REQUEST,
      );
    return await this.postsService.create({ ...newPost }, blogger.name);
  }

  @UseGuards(BasicGuards)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updPost: CreatePostDto) {
    return await this.postsService.update({
      id,
      ...updPost,
    });
  }

  @UseGuards(BasicGuards)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const post = await this.postsService.findOne(id, null);
    if (!post)
      throw new HttpException(
        { message: [{ message: 'invalid value', field: 'id' }] },
        HttpStatus.NOT_FOUND,
      );
    return this.postsService.remove(id);
  }

  @UseGuards(JwtExtract)
  @Get(':postId/comments')
  async getCommentsInPages(
    @Query() query,
    @Param('postId') postId: string,
    @Req() req,
  ) {
    const { page, pageSize, sortBy, sortDirection } = Pagination.getData(query);
    const userId = req.user.userId || null;
    return await this.commentsService.getCommentWithPage(
      postId,
      page,
      pageSize,
      userId,
      sortBy,
      sortDirection,
    );
  }

  @UseGuards(JwtExtract)
  @Post(':postId/comments')
  async createCommentForPost(
    @Param('postId') postId: string,
    @Body('content') content: string,
    @Req() req,
  ) {
    const userLogin = req.user.login;
    const userId = req.user.userId;
    const post = await this.commentsService.createComment(
      postId,
      content,
      userId,
      userLogin,
    );
    return post;
  }

  @UseGuards(JwtAuthGuards)
  @UseGuards(ExistingPostGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':postId/like-status')
  async updateActions(
    @Param('postId') postId: string,
    @Body('likeStatus') likeStatus: Actions,
    @Req() req,
  ) {
    if (Object.values(Actions).includes(likeStatus)) {
      const userId = req.user.payload.userId;
      const user = await this.usersService.findUserById(userId);

      return await this.postsService.updateActions(
        postId,
        likeStatus,
        userId,
        user.login,
      );
    }

    throw new HttpException(
      { message: [{ message: 'invalid value', field: 'likeStatus' }] },
      HttpStatus.BAD_REQUEST,
    );
  }
}
