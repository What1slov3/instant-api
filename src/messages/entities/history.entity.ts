import { Types } from 'mongoose';
import IMessage from '../interfaces/message.interface';
import { ApiProperty } from '@nestjs/swagger';
import { MessageEntity } from './messages.entity';

export class MessageHistoryEntity {
  @ApiProperty({ type: [MessageEntity] })
  history: IMessage[];

  @ApiProperty({ type: Boolean })
  hasMore: boolean;

  @ApiProperty({ type: String })
  chatId: Types.ObjectId;
}
