import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { PostEntity } from '../../posts/entities/post.entity';
import { CommentEntity } from '../../comments/entities/comment.entity';

@Entity('totalActions')
export class TotalActionsEntity {
  @Column('text')
  addedAt: string;
  @PrimaryColumn('uuid')
  userId: string;
  @Column('text')
  login: string;
  @Column('text')
  action: string;
  @Column('uuid')
  postId: string;
  @ManyToOne(() => PostEntity, (post) => post.totalActions)
  post: PostEntity;
  @ManyToOne(() => CommentEntity, (comment) => comment.totalActions)
  comment: CommentEntity;
}
