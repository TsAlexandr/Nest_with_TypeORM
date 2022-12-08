import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveFilesCommand } from '../commands/save-files.command';
import path from 'path';
import {
  ensureDirAsync,
  saveFileReader,
} from '../../../common/utils/fileReader';

@CommandHandler(SaveFilesCommand)
export class SaveFilesHandler implements ICommandHandler<SaveFilesCommand> {
  constructor() {}

  async execute(command: SaveFilesCommand) {
    const { originalName, buffer } = command;

    const dirPath = path.join('content', 'users', 'images');
    await ensureDirAsync(dirPath);
    await saveFileReader(path.join(dirPath, originalName), buffer);
  }
}
