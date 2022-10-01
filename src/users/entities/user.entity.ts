import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from '../../posts/entities/post.entity';
import { CommentEntity } from '../../comments/entities/comment.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  email: string;
  login: string;
  passwordHash: string;
  createdAt: string;
  unused: string;

  emailConfirm: {
    isConfirmed: boolean;
    confirmationCode: string;
    sentEmails: { type: [Date]; required: false };
  };
  @OneToMany(() => PostEntity, (post) => post.user)
  post: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comment: CommentEntity[];
}
