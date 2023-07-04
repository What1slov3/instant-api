import { ChannelEntity } from 'channels/entities/db/channel.entity';
import { ChatGroupEntity } from 'chats/entities/db/chatGroup.entity';

export default interface IChat {
  id: string;
  chatGroupId: string;
  chatGroup?: ChatGroupEntity;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
