import { SchemaFactory } from '@nestjs/mongoose';
import { Prop, raw, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import IChat from './interfaces/chat.interface';

export type ChatDocument = ChatModel & Document;

@Schema({ timestamps: true, collection: 'chats' })
export class ChatModel implements IChat {
  _id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'users' })
  owningChannelId: Types.ObjectId;

  @Prop({
    required: true,
    maxlength: 32,
    minlength: 3,
    validate: {
      validator: (name: string) => {
        return !name.includes('#');
      },
    },
    set: (value: string) => {
      return value.toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-').replace(/-$/, '');
    },
  })
  name: string;

  @Prop(
    raw({
      messageCount: {
        default: 0,
        type: Number,
      },
    }),
  )
  stats: { messageCount: number };

  createdAt: Date;
  updatedAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(ChatModel);
