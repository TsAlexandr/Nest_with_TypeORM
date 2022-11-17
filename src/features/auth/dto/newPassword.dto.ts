import { IsNotEmpty, IsString, Length } from 'class-validator';

export class NewPasswordDto {
  @Length(6, 20)
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  recoveryCode: string;
}
