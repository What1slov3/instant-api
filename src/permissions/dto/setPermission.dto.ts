import { EPermissions } from 'permissions/permissions';
import { countPermissionsTransform } from 'common/transforms/countPermissions.transfrom';
import { IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import type { TPermissionContext, TPermissionsStrings } from 'permissions/types';

export class SetPermissionsDTO {
  @IsNotEmpty()
  @Transform(countPermissionsTransform)
  permissions: EPermissions | TPermissionsStrings;

  @IsNotEmpty()
  @IsString()
  @IsIn(['chat', 'channel'] as TPermissionContext[])
  context: TPermissionContext;

  @IsNotEmpty()
  @IsUUID('4')
  contextId: string;

  @IsNotEmpty()
  @IsUUID('4')
  userId: string;
}
