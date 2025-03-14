import { SetMetadata } from '@nestjs/common';
import { TPermissionContext } from 'permissions/types/permission.types';

export const PermissionsContext = (context: TPermissionContext) => {
  if (context) {
    return SetMetadata('context', context);
  }

  console.warn('Not valid permissions');
};
