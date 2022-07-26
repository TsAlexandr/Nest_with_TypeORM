import { IsEmail, IsString, Length } from 'class-validator';

export class BloggersDto {
  @IsString({ message: 'to be string' })
  @Length(1, 15, { message: 'gt 0, lt: 15' })
  readonly name: string;
  @IsEmail()
  @Length(1, 30, { message: 'gt 0, lt: 30' })
  readonly youtubeUrl: string;
}
