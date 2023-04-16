import { Types } from 'mongoose';

export default interface IUser {
  _id: Types.ObjectId;
  email: string;
  username: string;
  tag: string;
  avatar: string;
  channels: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
