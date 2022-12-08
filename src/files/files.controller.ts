import {
  Controller,
  Get,
  Injectable,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { fileReader } from '../common/utils/fileReader';
import path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { SaveFilesHandler } from '../features/usecase/handlers/save-files.handler';

@Injectable()
@Controller('files')
export class FilesController {
  constructor(private saveFilesHandler: SaveFilesHandler) {}
  @Get('change-avatar')
  async changeAvatar() {
    return await fileReader(
      path.join('files', 'avatars', 'avatar-change.html'),
    );
  }

  @Post('update')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(@UploadedFile() file: Express.Multer.File) {
    await this.saveFilesHandler.execute({
      originalName: file.originalname,
      buffer: file.buffer,
    });
    return 'Avatar successfully updated';
  }
}
