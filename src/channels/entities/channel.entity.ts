import { Types } from 'mongoose';
import IChannel from '../interface/channel.interface';
import { ApiProperty } from '@nestjs/swagger';
import { ChatGroupEntity } from 'chats/entities/db/chatGroup.entity';


export class ChannelEntity implements IChannel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  icon: string;

  @ApiProperty()
  banner: string;

  @ApiProperty({ type: [String] })
  members: string[];

  @ApiProperty({ type: String })
  ownerId: string;

  @ApiProperty({ type: [ChatGroupEntity] })
  chatGroups: ChatGroupEntity[];

  @ApiProperty({ type: String })
  systemChatId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
