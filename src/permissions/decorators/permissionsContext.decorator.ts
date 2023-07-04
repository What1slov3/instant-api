import { SetMetadata } from '@nestjs/common';
import { PermissionsContext as TPermissionsContext } from 'permissions/interfaces/permission.interface';

export const PermissionsContext = (context: TPermissionsContext) => {
  if (context) {
    return SetMetadata('context', context);
  }

  console.warn('Not valid permissions');
};
