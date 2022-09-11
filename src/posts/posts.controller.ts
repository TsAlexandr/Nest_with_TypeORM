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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { NewPost } from '../common/types/classes/classes';
import { JwtExtract } from '../auth/guards/jwt.extract';
import { BasicGuards } from '../auth/guards/basic.guards';
import { JwtAuthGuards } from '../auth/guards/jwt-auth.guards';
import { CommentsService } from '../comments/comments.service';
import { BloggersService } from '../bloggers/bloggers.service';
import { ExistingPostGuard } from '../auth/guards/existingPostGuard';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersService } from '../users/users.service';
import { Pagination } from '../common/types/classes/pagination';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private commentsService: CommentsService,
    private bloggersService: BloggersService,
    private usersService: UsersService,
  ) {}

  @UseGuards(JwtExtract)
  @Get()
  async getAll(@Query() query, @Req() req) {
    const { page, pageSize, searchNameTerm } =
      Pagination.getPaginationData(query);
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
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const userId: string = req.user.userId || null;
    const post = await this.postsService.findOne(id, userId);
    return post;
  }

  @UseGuards(BasicGuards)
  @Post()
  async create(@Body() newPost: CreatePostDto) {
    const blogger = await this.bloggersService.getBloggerById(
      newPost.bloggerId,
    );
    const bloggerName = blogger.name;
    return await this.postsService.create({ ...newPost, bloggerName });
  }

  @UseGuards(BasicGuards)
  @Put(':id')
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
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.postsService.remove(id);
  }

  @UseGuards(JwtExtract)
  @Get(':postId/comments')
  async getCommentsInPages(
    @Query() query,
    @Param('postId') postId: string,
    @Req() req,
  ) {
    const { page, pageSize } = Pagination.getData(query);
    const userId = req.userId || null;
    return await this.commentsService.getCommentWithPage(
      postId,
      page,
      pageSize,
      userId,
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
  @HttpCode(204)
  @Put(':postId/like-status')
  async updateActions(
    @Param('postId') postId: string,
    @Body('likeStatus') likeStatus: string,
    @Req() req,
  ) {
    const userId = req.user.payload.sub;
    const user = await this.usersService.findUserById(userId);

    return await this.postsService.updateActions(
      postId,
      likeStatus,
      userId,
      user.accountData.login,
    );
  }
}
