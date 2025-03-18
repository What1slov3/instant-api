import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelPermissionEntity, ChatPermissionEntity } from './entities/db';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatPermissionEntity, ChannelPermissionEntity])
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
