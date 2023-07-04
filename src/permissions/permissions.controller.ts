import { Body, Controller, Get, Post, Req, UseGuards, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from 'auth/guards/jwt.guard';
import { SetPermissionsDTO } from './dto/setPermission.dto';
import { PermissionsGuard } from './guards/permissions.guard';
import { RequiredPermissions } from './decorators/permissions.decorator';
import { EPermissions } from './permissions';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionssService: PermissionsService) {}

  @RequiredPermissions(EPermissions['OWNER'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post('set')
  async setPermissions(@Body() body: SetPermissionsDTO) {
    this.permissionssService.setPermissions(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPermissions(@Query() query: any, @Req() req: Express.Request) {
    return this.permissionssService.getPermissions(query.context, query.contextId, req.user.id);
  }
}
