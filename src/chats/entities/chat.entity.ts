import { ApiProperty } from '@nestjs/swagger';
import IChat from '../interfaces/chat.interface';
import { ChatStatEntity } from './chatStat.entity';
import { ChannelEntity } from 'channels/entities/db/channel.entity';
import { ChatGroupEntity } from './db/chatGroup.entity';

export class ChatEntity implements IChat {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  owningChannelId: string;

  @ApiProperty({ type: ChannelEntity })
  owningChannel: ChannelEntity;

  @ApiProperty()
  name: string;

  @ApiProperty()
  chatGroupId: string;

  @ApiProperty()
  chatGroup?: ChatGroupEntity;

  // @ApiProperty()
  // stats: ChatStatsEntity;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
