import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import IMessage from '../../messages/interfaces/message.interface';
import { toMongoObjectIdTransform } from 'common';
import type { Types } from 'mongoose';

export class DeleteMessageDTO implements Pick<IMessage, '_id'> {
  @Transform(toMongoObjectIdTransform)
  @ApiProperty({ type: String })
  _id: Types.ObjectId;
}
