import { Types } from 'mongoose';

export default interface IMessage {
  _id: Types.ObjectId;
  content: MessageContent;
  context: MessageContext;
  senderId: Types.ObjectId;
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

export type MessageContext = {
  chatId: Types.ObjectId;
  channelId: Types.ObjectId;
};

export type MessageType = 'greetings' | never;

export type MessageMeta = {
  type: 'greetings';
  data: {
    userId: Types.ObjectId;
  };
} | null;
