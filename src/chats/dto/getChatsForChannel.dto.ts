import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { toMongoObjectId } from 'src/common/transforms/toMongoObjectId';

export class GetChatsForChannelDTO {
  @ApiProperty({ type: String })
  @Transform(toMongoObjectId)
  channelId: Types.ObjectId;
}
