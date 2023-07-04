import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { queryToArrayTransform } from '../../common';

export class GetUsersDTO {
  @IsNotEmpty()
  @Transform(queryToArrayTransform)
  @ApiProperty({ required: true, isArray: true, type: String })
  ids: string[];
}
