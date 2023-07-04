import { ChannelEntity } from 'channels/entities/db/channel.entity';
import { UserEntity } from 'users/entities/db/user.entity';

export interface IChannelMember {
  channelId: string;
  userId: string;
  channel: ChannelEntity;
  user: UserEntity;
  createdAt: Date;
  updatedAt: Date;
}
