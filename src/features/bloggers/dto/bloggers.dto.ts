import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class BloggersDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @Length(1, 15)
  name: string;
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/)
  @Length(1, 30)
  websiteUrl: string;
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @IsString()
  @Length(1, 500)
  description: string;
}
