import { IsBoolean, IsString, Length } from 'class-validator';

export class BanBlogDto {
  @IsBoolean()
  isBanned: boolean;
  @IsString()
  @Length(20)
  banReason: string;
  @IsString()
  blogId: string;
}
