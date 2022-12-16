import { BanUserDto } from '../../sa/users/dto/banUser.dto';

export class BanUserCommand {
  constructor(
    public readonly userId: string,
    public readonly banUserInfo: BanUserDto,
  ) {}
}
