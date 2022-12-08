import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from '../../../public/posts/entities/post.entity';
import { CommentEntity } from '../../../public/comments/entities/comment.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text')
  email: string;
  @Column('text')
  login: string;
  @Column('text')
  passwordHash: string;
  @Column('time with time zone')
  createdAt: Date;
  @Column('text')
  unused: string;
  @Column('boolean', { default: false })
  isConfirmed: boolean;
  @Column('text')
  confirmationCode: string;
  @Column()
  sentDate: Date;

  @OneToMany(() => PostEntity, (post) => post.user)
  post: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.userId)
  comment: CommentEntity[];
}
