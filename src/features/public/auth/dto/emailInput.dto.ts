import { Matches } from 'class-validator';

export class EmailInputDto {
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
