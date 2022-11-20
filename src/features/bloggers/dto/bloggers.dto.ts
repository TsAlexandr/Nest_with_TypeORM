import { IsString, Length, Matches } from 'class-validator';

export class BloggersDto {
  @IsString()
  @Length(1, 15)
  name: string;
  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/)
  @Length(1, 30)
  websiteUrl: string;
  @IsString()
  @Length(1, 500)
  description: string;
}
