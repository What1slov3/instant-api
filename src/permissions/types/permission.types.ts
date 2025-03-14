import type { UUID } from 'common';
import type { Types } from 'mongoose';
import type { EPermissions } from 'permissions/permissions';


export type TPermissionRule = number; // число формата u64 (double float в случае js, 53 бита под целую часть), в котором каждый бит представляет правило доступа
export type TPermissionContext = 'channel' | 'chat';

export type TPermissionsStrings = keyof typeof EPermissions;

export type TPermissionContextId = UUID | Types.ObjectId;