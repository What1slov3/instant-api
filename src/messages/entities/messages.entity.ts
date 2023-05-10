import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { MessageContentDTO, MessageContextDTO } from '../dto';
import type { MessageContext, MessageContent, MessageType, MessageMeta } from '../interfaces/message.interface';
import type IMessage from '../interfaces/message.interface';

export class MessageEntity implements IMessage {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: MessageContentDTO })
  content: MessageContent;

  @ApiProperty({ type: MessageContextDTO })
  context: MessageContext;

  @ApiProperty({ type: String })
  senderId: Types.ObjectId;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  meta: MessageMeta;

  @ApiProperty()
  createdAt: Date;
}
