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
import { TotalActionsEntity } from '../../../library/entities/actions.entity';

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
  blogId: string;
  @Column('text')
  blogName: string;
  @Column('text')
  createdAt: Date;
  @ManyToOne(() => BloggersEntity, (blogger) => blogger.post)
  blogger: BloggersEntity;
  @ManyToOne(() => UserEntity, (user) => user.post)
  user: UserEntity;
  @OneToMany(() => CommentEntity, (comment) => comment.postId)
  comment: CommentEntity[];
  @OneToMany(() => TotalActionsEntity, (totalActions) => totalActions.postId)
  totalActions: TotalActionsEntity[];
}
