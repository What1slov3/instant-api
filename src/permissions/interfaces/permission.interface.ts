import { EPermissions } from 'permissions/permissions';
import { Types } from 'mongoose';

export type Permissions = number; // число формата u32, в котором каждый бит представляет правило доступа
export type PermissionsContext = 'channel' | 'chat';

export interface IAssociatedPermission<T extends string | Types.ObjectId> {
  contextId: T;
  permissions: Permissions;
}

export type PermissionsStrings = keyof typeof EPermissions;