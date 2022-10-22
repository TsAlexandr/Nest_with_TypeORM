import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from '../../posts/entities/post.entity';

@Entity('bloggers')
export class BloggersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text')
  name: string;
  @Column('text')
  youtubeUrl: string;
  @OneToMany(() => PostEntity, (post) => post.bloggerId)
  post: PostEntity[];
}
