import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { PermissionsModule } from 'permissions/permissions.module';
import { ChannelMemberEntity } from 'channels/entities/db/channelMember.entity';
import { ChannelEntity } from './entities/db/channel.entity';
import { ChatsModule } from 'chats/chats.module';

@Module({
  imports: [PermissionsModule, TypeOrmModule.forFeature([ChannelEntity, ChannelMemberEntity]), ChatsModule],
  controllers: [ChannelsController],
  providers: [ChannelsService],
  exports: [ChannelsService]
})
export class ChannelsModule {}
