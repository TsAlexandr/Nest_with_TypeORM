import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { PostEntity } from '../../posts/entities/post.entity';

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
  @ManyToOne(() => PostEntity, (post) => post.totalActions)
  post: PostEntity;
}
