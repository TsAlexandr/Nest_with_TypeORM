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
  @Column('jsonb')
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    newestLikes: [];
  };
  @Column('jsonb', { array: true })
  totalActions: {
    addedAt: string;
    userId: string;
    login: string;
    action: string;
  };
  @ManyToOne(() => BloggersEntity, (blogger) => blogger.post)
  blogger: BloggersEntity;
  @ManyToOne(() => UserEntity, (user) => user.post)
  user: UserEntity;
  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comment: CommentEntity;
}
