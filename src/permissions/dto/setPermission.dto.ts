import { PermissionsContext } from './../interfaces/permission.interface';
import { EPermissions } from 'permissions/permissions';
import { PermissionsStrings } from 'permissions/interfaces/permission.interface';
import { countPermissionsTransform } from 'common/transforms/countPermissions.transfrom';
import { IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class SetPermissionsDTO {
  @IsNotEmpty()
  @Transform(countPermissionsTransform)
  permissions: EPermissions | PermissionsStrings;

  @IsNotEmpty()
  @IsString()
  @IsIn(['chat', 'channel'] as PermissionsContext[])
  context: PermissionsContext;

  @IsNotEmpty()
  @IsUUID('4')
  contextId: string;

  @IsNotEmpty()
  @IsUUID('4')
  userId: string;
}
