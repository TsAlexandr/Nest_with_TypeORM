import { Controller, Get, Body, Param, Delete, Put } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.commentsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() content: string) {
    return await this.commentsService.update(id, content);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.commentsService.remove(id);
  }
}
