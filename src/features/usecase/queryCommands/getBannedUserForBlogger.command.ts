import { SortOrder } from 'mongoose';

export class GetBannedUserForBloggerCommand {
  constructor(
    public readonly page: number,
    public readonly pageSize: number,
    public readonly sortBy: string,
    public readonly sortDirection: SortOrder,

    public readonly searchLoginTerm: string,
    public readonly id: string,
    public readonly ownerId: string,
  ) {}
}
