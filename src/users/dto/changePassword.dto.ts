import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  newPassword: string;
}
