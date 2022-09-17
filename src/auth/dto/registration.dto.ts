import { IsString, Length, Matches } from 'class-validator';

export class RegistrationDto {
  @IsString()
  @Length(3, 10)
  login: string;
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
  @IsString()
  @Length(6, 20)
  password: string;
}
