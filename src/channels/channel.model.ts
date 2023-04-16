import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import IChannel from './interface/channel.interface';

export type ChannelDocument = ChannelModel & Document;

@Schema({ timestamps: true, collection: 'channels' })
export class ChannelModel implements IChannel {
  _id: Types.ObjectId;

  @Prop({
    required: true,
    maxlength: 32,
    trim: true,
  })
  name: string;

  @Prop({ required: true })
  icon: string;

  @Prop({ required: true, ref: 'users', type: Types.ObjectId })
  members: Types.ObjectId[];

  @Prop({ required: true, ref: 'users', type: Types.ObjectId })
  ownerId: Types.ObjectId;

  @Prop(raw([{ name: { type: String, required: true }, chats: { type: [Types.ObjectId], required: true } }]))
  chatGroups: { name: string; chats: Types.ObjectId[] }[];

  @Prop({ required: true, type: Types.ObjectId, ref: 'chats' })
  systemChatId: Types.ObjectId;

  @Prop({
    default: '#d39dff',
    validate: {
      validator: (value: string) => {
        // TODO
      },
    },
  })
  banner: string;

  createdAt: Date;
  updatedAt: Date;
}

export const ChannelSchema = SchemaFactory.createForClass(ChannelModel);
