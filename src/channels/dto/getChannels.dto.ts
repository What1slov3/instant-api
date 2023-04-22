import { toMongoObjectId } from '../../common/transforms/toMongoObjectId';
import { queryToArray } from '../../common/transforms/queryToArray';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class GetChannelsDTO {
  @ApiProperty({type: [String]})
  @Transform(queryToArray)
  @Transform(toMongoObjectId)
  ids: Types.ObjectId[];
}
