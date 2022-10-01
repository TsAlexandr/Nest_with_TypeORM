import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { PostEntity } from '../../posts/entities/post.entity';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('uuid')
  postId: string;
  @Column('text')
  content: string;
  @Column('uuid')
  userId: string;
  @Column('text')
  userLogin: string;
  @Column('text')
  addedAt: string;
  @Column('jsonb')
  likesInfo: {
    dislikesCount: number;
    likesCount: number;
    myStatus: string;
  };
  @Column('jsonb', { array: true })
  totalActions: {
    addedAt: string;
    userId: string;
    login: string;
    action: string;
  };
  @ManyToOne(() => PostEntity, (post) => post.comment)
  post: PostEntity;
  @ManyToOne(() => UserEntity, (user) => user.comment)
  user: UserEntity;
}
