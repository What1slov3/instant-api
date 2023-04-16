import { SchemaFactory } from '@nestjs/mongoose';
import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { generateString } from 'src/common';
import { IInvite } from './interfaces/invites.interface';

export type InviteeDocument = InviteModel & Document;

@Schema({ timestamps: true, collection: 'invites' })
export class InviteModel implements IInvite {
  @Prop({
    type: String,
    default: () => {
      return generateString(Number(process.env.INVITE_LINK_LENGTH));
    },
  })
  _id: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'channels', index: true })
  channelId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const InviteSchema = SchemaFactory.createForClass(InviteModel);
