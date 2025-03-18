import { ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import IMessage, { MessageContent } from '../../messages/interfaces/message.interface';
import { MessageContentDTO } from './message.dto';
import { toMongoObjectIdTransform } from 'common';
import type { Types } from 'mongoose';

export class EditMessageDTO implements Pick<IMessage, '_id' | 'content'> {
  @Transform(toMongoObjectIdTransform)
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ValidateNested({ each: true })
  @Type(() => MessageContentDTO)
  @ApiProperty({ type: MessageContentDTO })
  content: MessageContent;
}
