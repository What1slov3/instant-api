import { Injectable, StreamableFile, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  getFile(fid: string): StreamableFile {
    if (!fs.existsSync(`${process.env.UPLOAD_LOCATION}/${fid}`)) {
      throw new BadRequestException(`File does not exist: ${fid}`);
    }

    const file = fs.createReadStream(`${process.env.UPLOAD_LOCATION}/${fid}`);
    return new StreamableFile(file);
  }

  deleteFile(fid: string) {
    if (!fs.existsSync(`${process.env.UPLOAD_LOCATION}/${fid}`)) {
      throw new BadRequestException(`File does not exist: ${fid}`);
    }

    try {
      fs.unlinkSync(`${process.env.UPLOAD_LOCATION}/${fid}`);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
