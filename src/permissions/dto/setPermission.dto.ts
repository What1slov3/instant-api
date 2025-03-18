import { EPermissions } from 'permissions/permissions';
import { countPermissionsTransform } from 'common/transforms/countPermissions.transfrom';
import { IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import type { UUID } from 'common';
import type { EPermissionContext } from 'permissions/permissions.const';
import type { IUser } from 'users/interfaces';

export class SetPermissionsDTO {
  @IsUUID('4')
  userId: IUser['id'];

  @IsNotEmpty()
  @Transform(countPermissionsTransform)
  rule: EPermissions;

  @IsUUID('4')
  contextId: UUID;

  @IsNotEmpty()
  @IsString()
  @IsIn(['chat', 'channel'] as EPermissionContext[])
  context: EPermissionContext;
}
