import { Types } from 'mongoose';

export default interface IChannel {
  _id: Types.ObjectId;
  name: string;
  icon: string;
  banner: string;
  members: Types.ObjectId[];
  ownerId: Types.ObjectId;
  chatGroups: { name: string; chats: Types.ObjectId[] }[];
  systemChatId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
