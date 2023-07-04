import { SchemaFactory } from '@nestjs/mongoose';
import { Prop, raw, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import IMessage, { MessageMeta } from './interfaces/message.interface';

export type MessageDocument = MessageModel & Document;

@Schema({ timestamps: true, collection: 'messages' })
export class MessageModel implements IMessage {
  _id: Types.ObjectId;

  @Prop(
    raw({
      text: { type: String, default: '', maxlength: 4000, trim: true },
      attachments: { files: { type: [String], required: false, default: null } },
    }),
  )
  content: { text: string; attachments?: { files: string[] } };

  @Prop({ required: true, type: String, index: true })
  chatId: string;

  @Prop({ required: true, type: String })
  senderId: string;

  @Prop(
    raw({
      type: { type: String },
      data: { type: Object },
    }),
  )
  meta: MessageMeta;

  createdAt: Date;
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(MessageModel);
