import { HttpException, HttpStatus } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path/posix';
import { generateString } from '../utils/generateString';

const generateFileName = (file: Express.Multer.File) => {
  return `${generateString(25)}${extname(file.originalname)}`;
};

const multerStorage = diskStorage({
  destination: (req, file, cb) => {
    const uploadDest = process.env.UPLOAD_LOCATION;
    if (!existsSync(uploadDest)) {
      mkdirSync(uploadDest);
    }
    cb(null, uploadDest);
  },
  filename: (req, file, cb) => {
    cb(null, generateFileName(file));
  },
});

export const multerOptions = {
  limits: {
    fileSize: 8e6,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      cb(null, true);
    } else {
      cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST));
    }
  },
  storage: multerStorage,
};
