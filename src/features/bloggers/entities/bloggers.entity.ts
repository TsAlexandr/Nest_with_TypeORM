import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from '../../posts/entities/post.entity';

@Entity('bloggers')
export class BloggersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text')
  name: string;
  @Column('text')
  websiteUrl: string;
  @Column('text')
  description: string;
  @Column('date')
  createdAt: Date;
  @OneToMany(() => PostEntity, (post) => post.blogId)
  post: PostEntity[];
}
