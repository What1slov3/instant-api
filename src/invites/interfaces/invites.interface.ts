import { Types } from 'mongoose';

export interface IInvite {
  _id: string;
  channelId: Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}
