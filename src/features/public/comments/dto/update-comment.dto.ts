import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { Length } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @Length(20, 300)
  content: string;
}
