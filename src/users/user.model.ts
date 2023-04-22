import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { generateTag } from '../common';
import IUser from './interfaces/user.interface';

export type UserDocument = UserModel & Document;

@Schema({ timestamps: true, collection: 'users' })
export class UserModel implements IUser {
  _id: Types.ObjectId;

  @Prop({
    default: generateTag,
    length: 4,
    validate: {
      validator: (tag: string) => {
        return /^\d+$/.test(tag);
      },
    },
  })
  tag: string;

  @Prop({
    minlength: 4,
    maxlength: 32,
    validate: {
      validator: (username: string) => {
        return !username.includes('@');
      },
    },
    required: true,
    trim: true,
  })
  username: string;

  @Prop({
    validate: {
      validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    },
    required: true,
    unique: true,
    index: true,
    trim: true,
  })
  email: string;

  @Prop({
    trim: true,
    default: '',
  })
  avatar: string;

  @Prop({
    required: true,
  })
  passwordHash: string;

  @Prop({
    ref: 'channels',
    type: Types.ObjectId,
  })
  channels: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
