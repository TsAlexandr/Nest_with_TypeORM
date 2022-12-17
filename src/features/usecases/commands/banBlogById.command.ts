export class BanBlogByIdCommand {
  constructor(public readonly id: string, public readonly isBanned: boolean) {}
}
