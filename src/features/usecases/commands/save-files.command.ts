export class SaveFilesCommand {
  constructor(
    public readonly originalName: string,
    public readonly buffer: Buffer,
  ) {}
}
