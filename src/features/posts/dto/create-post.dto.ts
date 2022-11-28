import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { BlogIdValidation } from '../../../common/exceptions/validationBlog';

export class CreatePostDto {
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @Length(1, 30)
  title: string;
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @Length(1, 100)
  shortDescription: string;
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @Length(1, 1000)
  content: string;
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @Length(1)
  @Validate(BlogIdValidation)
  blogId: string;
}
