import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bloggers')
export class Bloggers {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  name: string;
  @Column()
  youtubeUrl: string;
}
