import type { UUID } from 'common';
import type { TPermissionRule, TPermissionContext, TPermissionContextId } from 'permissions/types';
import type { IUser } from 'users/interfaces';

export interface IAssociatedPermission<T extends TPermissionContextId> {
  contextId: T;
  permissionRule: TPermissionRule;
}

type MappedContext<T extends TPermissionContextId> = {
  [key in TPermissionContext]: IAssociatedPermission<T>;
};

export interface IPermission {
  id: string;
  userId: IUser['id'];
  contextId: UUID;
  rule: TPermissionRule;
}
