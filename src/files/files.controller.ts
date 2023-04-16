import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { extname } from 'path';
import { FilesService } from './files.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiOperation({summary: 'Получить файл по его ID'})
  @Get(':fileId')
  async getFile(@Param('fileId') fileId: string, @Res({ passthrough: true }) res: Response) {
    res.set({
      'Content-Type': `image/${extname(fileId).slice(1)}`,
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=31536000',
    });
    return this.filesService.getFile(fileId);
  }
}
