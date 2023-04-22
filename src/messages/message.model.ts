import { SchemaFactory } from '@nestjs/mongoose';
import { Prop, raw, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import IMessage from './interfaces/message.interface';

export type MessageDocument = MessageModel & Document;

@Schema({ timestamps: true, collection: 'messages' })
export class MessageModel implements IMessage {
  _id: Types.ObjectId;

  @Prop(
    raw({
      text: { type: String, default: '', maxlength: 4000, trim: true },
      attachments: { files: { type: [String], required: false } },
    }),
  )
  content: { text: string; attachments?: { files: string[] } };

  @Prop(
    raw({
      chatId: { required: true, type: Types.ObjectId, ref: 'chats' },
      channelId: { required: true, type: Types.ObjectId, ref: 'channels' },
    }),
  )
  context: { chatId: Types.ObjectId; channelId: Types.ObjectId };

  @Prop({ required: true, type: Types.ObjectId, ref: 'users' })
  senderId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(MessageModel);
