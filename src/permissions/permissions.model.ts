import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IAssociatedPermission } from './interfaces/permission.interface';

const permissionsRaw = raw([
  {
    _id: false,
    contextId: {
      type: String,
      required: true,
    },
    permissions: {
      type: Number,
      required: true,
      validate: {
        validator: (permissions: number) => {
          return permissions >= 0 && Number.isSafeInteger(permissions);
        },
      },
    },
  },
]);

export type PermissionsDocument = PermissionsModel & Document;

@Schema({ timestamps: true, collection: 'permissions' })
export class PermissionsModel {
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  userId: string;

  @Prop({
    default: [],
    type: permissionsRaw,
  })
  chat: IAssociatedPermission<string>[];

  @Prop({
    default: [],
    type: permissionsRaw,
  })
  channel: IAssociatedPermission<string>[];

  createdAt: Date;
  updatedAt: Date;
}

export const PermissionsSchema = SchemaFactory.createForClass(PermissionsModel);
