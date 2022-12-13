import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../sa/users/users.repository';
import { NotFoundException } from '@nestjs/common';
import { GetPostByIdCommand } from '../commands/getPostById.command';
import { PostsRepository } from '../../public/posts/posts.repository';
import { BlogsRepository } from '../../public/blogs/blogs.repository';

@QueryHandler(GetPostByIdCommand)
export class GetPostByIdHandler implements IQueryHandler<GetPostByIdCommand> {
  constructor(
    private postsRepository: PostsRepository,
    private usersRepository: UsersRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute(command: GetPostByIdCommand) {
    const { id } = command;
    const post = await this.postsRepository.findPostById(id);
    if (!post) throw new NotFoundException();
    const blogger = await this.blogsRepository.getBloggersById(post.blogId);
    const user = await this.usersRepository.findById(
      blogger.blogOwnerInfo.userId,
    );
    if (user.banInfo.isBanned === false) {
      const currentUserStatus = post.totalActions.find(
        (el: { userId: string }) => el.userId === user.id,
      );
      const likesCount = post.totalActions.filter(
        (el) => el.action === 'Like',
      ).length;
      const dislikesCount = post.totalActions.filter(
        (el) => el.action === 'Dislike',
      ).length;
      const actions = post.totalActions;
      return {
        createdAt: post.createdAt,
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        extendedLikesInfo: {
          likesCount: likesCount,
          dislikesCount: dislikesCount,
          myStatus: currentUserStatus ? currentUserStatus.action : 'None',
          newestLikes: actions
            .filter((el) => el.action === 'Like')
            .reverse()
            .slice(0, 3)
            .map((el) => {
              delete el.action;
              return el;
            }),
        },
      };
    } else {
      return {
        createdAt: post.createdAt,
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      };
    }
  }
}
