import { Types } from 'mongoose';
import IChannel from '../interface/channel.interface';
import { ApiProperty } from '@nestjs/swagger';
import { ChatGroupEntity } from './chatGroup.entity';

export class ChannelEntity implements IChannel {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty()
  name: string;

  @ApiProperty()
  icon: string;

  @ApiProperty()
  banner: string;

  @ApiProperty({ type: [String] })
  members: Types.ObjectId[];

  @ApiProperty({ type: String })
  ownerId: Types.ObjectId;

  @ApiProperty({ type: [ChatGroupEntity] })
  chatGroups: { name: string; chats: Types.ObjectId[] }[];

  @ApiProperty({ type: String })
  systemChatId: Types.ObjectId;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
