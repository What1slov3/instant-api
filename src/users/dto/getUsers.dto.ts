import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { queryToArray, toMongoObjectId } from 'src/common';

export class GetUsersDTO {
  @IsNotEmpty()
  @Transform(queryToArray)
  @Transform(toMongoObjectId)
  @ApiProperty({ required: true, isArray: true, type: String })
  ids: Types.ObjectId[];
}
