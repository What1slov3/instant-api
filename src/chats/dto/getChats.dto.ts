import { toMongoObjectIdTransform } from '../../common/transforms/toMongoObjectId.transform';
import { queryToArrayTransform } from '../../common/transforms/queryToArray.transform';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class GetChatsDTO {
  @ApiProperty({ type: [String] })
  @Transform(queryToArrayTransform)
  ids: string[];
}
