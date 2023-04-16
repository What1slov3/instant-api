import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RefreshTokenDocument = RefreshTokenModel & Document;

@Schema({ timestamps: true, collection: 'refresh-tokens' })
export class RefreshTokenModel {
  @Prop({ required: true, index: true })
  sub: string;
}

export const RefreshTokenSchema =
  SchemaFactory.createForClass(RefreshTokenModel);
