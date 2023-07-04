import { BadRequestException } from '@nestjs/common';
import { EPermissions } from 'permissions/permissions';

export function countPermissionsTransform({ value }: { value: string[] | string | number }): number {
  if (typeof value === 'number' && value >= 0 && Number.isSafeInteger(value)) {
    return value;
  }

  if (typeof value === 'string') {
    if (EPermissions[value]) {
      return EPermissions[value];
    }
  }

  if (Array.isArray(value)) {
    let permissions = 0;

    value.forEach((permission) => {
      if (EPermissions[permission]) {
        permissions |= EPermissions[permission];
      }
    });

    return permissions;
  }

  throw new BadRequestException(`${value} is not a valid permissions`);
}