import { ChatEntity } from 'chats/entities/db/chat.entity';

export interface IChatGroup {
  id: string;
  name: string;
  owningChannelId: string;
  owningChannel?: string;
  chats: ChatEntity[] | string[];
  createdAt: Date;
  updatedAt: Date;
}
