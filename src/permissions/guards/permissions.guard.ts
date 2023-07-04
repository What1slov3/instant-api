import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsContext } from 'permissions/interfaces/permission.interface';
import { EPermissions } from 'permissions/permissions';
import { PermissionsService } from 'permissions/permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly permissionsService: PermissionsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<number>('permissions', context.getHandler());
    const permissionsContext = this.reflector.get<PermissionsContext>('context', context.getHandler());

    const request = context.switchToHttp().getRequest();

    const body = request.body as any;
    const user = request.user as Express.Request['user'];

    if (!permissionsContext || !requiredPermissions) {
      console.warn(`No permissions context or permissions provided, user: ${user.id}`);
      return false;
    }

    if (!body.context[permissionsContext]) {
      console.warn(`Invalid context provided, route: ${request.route.path}, user: ${user.id}`);
      return false;
    }

    const permissions = await this.permissionsService.getPermissions(
      permissionsContext,
      body.context[permissionsContext],
      user.id,
    );

    const userPermissions = permissions[permissionsContext]?.permissions;

    return (
      (userPermissions & requiredPermissions) === requiredPermissions ||
      Boolean(userPermissions & EPermissions['ADMIN'])
    );
  }
}
