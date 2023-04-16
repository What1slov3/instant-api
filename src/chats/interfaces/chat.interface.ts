import { Types } from 'mongoose';

export default interface IChat {
  _id: Types.ObjectId;
  owningChannelId: Types.ObjectId;
  name: string;
  stats: IChatStats;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatStats {
  messageCount: number;
}
