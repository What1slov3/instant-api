import { constructDTO, type UUID } from '../../common';
import type { IUser } from 'users/interfaces';
import type { EPermissionContext } from 'permissions/permissions.const';
import type { TPermissionRule } from 'permissions/types';

export interface IUserPermission {
  userId: IUser['id'];
  contextId: UUID;
  context: EPermissionContext;
  rule: TPermissionRule;
}

export class PermissionsDTO implements IUserPermission {
  userId: IUser['id'];
  context: EPermissionContext;
  contextId: UUID;
  rule: number;

  constructor(data: any) {
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }

  get() {
    return constructDTO<this, keyof Exclude<IUserPermission, 'updatedAt' | 'createdAt'>>(this, [
      'userId',
      'context',
      'contextId',
      'rule',
    ]);
  }

  createAsContextSetter(data: IUserPermission) {
    return constructDTO<this, keyof Exclude<IUserPermission, 'updatedAt' | 'createdAt'>>(this, [
      'userId',
      'context',
      'contextId',
      'rule',
    ]);
  }
}
