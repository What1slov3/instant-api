import { ApiProperty } from '@nestjs/swagger';

export class UploadedFileDTO {
  @ApiProperty()
  url: string;

  @ApiProperty()
  originalName: string;
}
