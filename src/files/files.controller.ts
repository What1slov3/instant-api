import { Controller, Get, Param, Res, Post, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { extname } from 'path';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { createURLtoFile, multerOptions } from '../common';
import { UploadedFileDTO } from './dto/response/uploadedFile.dto';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiOperation({ summary: 'Получить файл по его ID' })
  @ApiConsumes('multipart/form-data')
  @Get(':fileId')
  getFile(@Param('fileId') fileId: string, @Res({ passthrough: true }) res: Response) {
    res.set({
      'Content-Type': `image/${extname(fileId).slice(1)}`,
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=31536000',
    });
    return this.filesService.getFile(fileId);
  }

  @ApiOperation({ summary: 'Загрузка файлов (до 3 штук)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({ type: [UploadedFileDTO] })
  @Post('/upload')
  @UseInterceptors(FilesInterceptor('files[]', 3, multerOptions))
  uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    return files.map((file) => {
      return {
        url: createURLtoFile(file.filename),
        name: file.originalname,
      };
    });
  }

  @ApiOperation({ summary: 'Удаление файла по его fileId' })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @Get('/delete/:fid')
  deleteFile(@Param('fid') fileId: string) {
    return this.filesService.deleteFile(fileId);
  }
}
