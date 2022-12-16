import { BanBlogDto } from '../../blogger/dto/banBlog.dto';

export class BanUserForBlogCommand {
  constructor(
    public readonly id: string,
    public readonly banBlogDto: BanBlogDto,
  ) {}
}
