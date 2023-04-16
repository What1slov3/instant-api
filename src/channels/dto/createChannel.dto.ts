import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateChannelDTO {
  @ApiProperty({ description: 'Название канала' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  name: string;

  @IsString()
  iconName?: string;
}
