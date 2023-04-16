import { toMongoObjectId } from 'src/common/transforms/toMongoObjectId';
import { queryToArray } from 'src/common/transforms/queryToArray';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class GetChannelsDTO {
  @ApiProperty({type: [String]})
  @Transform(queryToArray)
  @Transform(toMongoObjectId)
  ids: Types.ObjectId[];
}
