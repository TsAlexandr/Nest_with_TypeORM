import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BloggersEntity } from '../../bloggers/entities/bloggers.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { CommentEntity } from '../../comments/entities/comment.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text')
  title: string;
  @Column('text')
  shortDescription: string;
  @Column('text')
  content: string;
  @Column('uuid')
  bloggerId: string;
  @Column('text')
  bloggerName: string;
  @Column('text')
  addedAt: string;
  @ManyToOne(() => BloggersEntity, (blogger) => blogger.post)
  blogger: BloggersEntity;
  @ManyToOne(() => UserEntity, (user) => user.post)
  user: UserEntity;
  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comment: CommentEntity;
  @OneToMany(() => LikesInfoEntity, (likesInfo) => likesInfo.post)
  likesInfo: LikesInfoEntity;
  @OneToMany(() => TotalActionsEntity, (totalActions) => totalActions.post)
  totalActions: TotalActionsEntity;
}

@Entity('likesInfo')
export class LikesInfoEntity {
  @Column('int')
  likesCount: number;
  @Column('int')
  dislikesCount: number;
  @ManyToOne(() => PostEntity, (post) => post.likesInfo)
  post: PostEntity;
}

@Entity('TotalActions')
export class TotalActionsEntity {
  @Column('text')
  addedAt: string;
  @Column('uuid')
  userId: string;
  @Column('text')
  login: string;
  @Column('text')
  action: string;
  @ManyToOne(() => PostEntity, (post) => post.totalActions)
  post: PostEntity;
}
