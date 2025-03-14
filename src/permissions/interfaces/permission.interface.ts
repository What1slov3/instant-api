import type IUser from 'users/interfaces/user.interface';
import type { DBTimestamps, UUID } from 'common';
import type { TPermissionRule, TPermissionContext, TPermissionContextId } from 'permissions/types';

export interface IAssociatedPermission<T extends TPermissionContextId> {
  contextId: T;
  permissionRule: TPermissionRule;
}

type MappedContext<T extends TPermissionContextId> = {
  [key in TPermissionContext]: IAssociatedPermission<T>;
};

export interface IUserPermission<T extends TPermissionContextId = UUID> extends MappedContext<T>, DBTimestamps {
  userId: IUser['id'];
  channel: IAssociatedPermission<T>;
  chat: IAssociatedPermission<T>;
}

export interface IPermission {
  id: string;
  userId: UUID;
  contextId: UUID;
  rule: TPermissionRule;
}
