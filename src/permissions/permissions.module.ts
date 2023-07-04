import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { PermissionsModel, PermissionsSchema } from './permissions.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PermissionsModel.name, schema: PermissionsSchema }]),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
