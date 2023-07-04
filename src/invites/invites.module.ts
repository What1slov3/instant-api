import { Module } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { InvitesController } from './invites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteEntity } from './entities/db/invite.entity';
import { ChannelEntity } from 'channels/entities/db/channel.entity';
import { ChannelsModule } from 'channels/channels.module';
import { MessagesModule } from 'messages/messages.module';

@Module({
  imports: [TypeOrmModule.forFeature([InviteEntity, ChannelEntity]), ChannelsModule, MessagesModule],
  providers: [InvitesService],
  controllers: [InvitesController],
})
export class InvitesModule {}
