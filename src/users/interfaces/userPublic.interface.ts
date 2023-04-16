import { Types } from 'mongoose';

export default interface IUserPublic {
  _id: Types.ObjectId;
  email: string;
  username: string;
  tag: string;
  avatar: string;
}
