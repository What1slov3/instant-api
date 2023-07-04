import { SetMetadata } from '@nestjs/common';

export const RequiredPermissions = (permissions: number | number[]) => {
  if (Array.isArray(permissions)) {
    let summaryPermissions = 0;

    permissions.forEach((permission) => {
      summaryPermissions |= permission;
    });

    return SetMetadata('permissions', summaryPermissions);
  }

  if (permissions >= 0 && Number.isSafeInteger(permissions)) {
    return SetMetadata('permissions', permissions);
  }

  console.warn('Not valid permissions');
};
