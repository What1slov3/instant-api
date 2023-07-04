import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import type { MessageContent, MessageMeta } from '../interfaces/message.interface';
import type IMessage from '../interfaces/message.interface';
import { MessageContentDTO } from 'messages/dto';

export class MessageEntity implements IMessage {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: MessageContentDTO })
  content: MessageContent;

  @ApiProperty({ type: String })
  senderId: string;

  @ApiProperty()
  chatId: string;

  @ApiProperty()
  meta: MessageMeta;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;
}
