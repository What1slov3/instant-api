import { Types } from 'mongoose';
import { ChatEntity } from 'chats/entities';
import { UserEntity } from 'users/entities/db/user.entity';

export default interface IMessage {
  _id: Types.ObjectId;
  content: MessageContent;
  chatId: ChatEntity['id'];
  senderId: string;
  meta: MessageMeta;
  updatedAt: Date;
  createdAt: Date;
}

export type MessageContent = {
  text: string;
  attachments?: MessageAttachments;
};

export type MessageAttachments = {
  files?: string[];
};

export type MessageType = 'greetings' | never;

export type MessageMeta = {
  type: 'greetings';
  data: {
    userId: UserEntity['id'];
  };
} | null;
