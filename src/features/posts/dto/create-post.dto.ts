import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @IsString()
  @Length(0, 30)
  title: string;
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @IsString()
  @Length(0, 100)
  shortDescription: string;
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @IsString()
  @Length(0, 1000)
  content: string;
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @IsString()
  blogId: string;
}
