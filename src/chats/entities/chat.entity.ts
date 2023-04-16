import { Types } from 'mongoose';
import IChat, { IChatStats } from '../interfaces/chat.interface';
import { ApiProperty } from '@nestjs/swagger';

class ChatStatsEntity implements IChatStats {
  @ApiProperty({ description: 'Количество сообщений в чате' })
  messageCount: number;
}

export class ChatEntity implements IChat {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: String })
  owningChannelId: Types.ObjectId;

  @ApiProperty()
  name: string;

  @ApiProperty()
  stats: ChatStatsEntity;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
