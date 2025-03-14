import { constructDTO, type UUID } from '../../common';
import type { IAssociatedPermission, IUserPermission } from 'permissions/interfaces/permission.interface';
import type { Types } from 'mongoose';

export class PermissionsDTO implements IUserPermission<UUID | Types.ObjectId> {
  userId: string;
  updatedAt: string | Date;
  createdAt: string | Date;
  channel: IAssociatedPermission<UUID | Types.ObjectId>;
  chat: IAssociatedPermission<UUID | Types.ObjectId>;

  constructor(data: any) {
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }

  get() {
    return constructDTO<this, keyof Exclude<IUserPermission, 'updatedAt' | 'createdAt'>>(this, [
      'channel',
      'chat',
      'userId',
    ]);
  }

  createAsContextSetter(data: IUserPermission) {
    return constructDTO<this, keyof Exclude<IUserPermission, 'updatedAt' | 'createdAt'>>(this, [
      'channel',
      'chat',
      'userId',
    ]);
  }
}
