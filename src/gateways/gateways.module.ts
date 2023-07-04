import { Module } from '@nestjs/common';
import { MainGateway } from './main.gateway';
import { MessagesGateway } from './messages.gateway';
import { ChannelsGateway } from './channels.gateway';

@Module({
  providers: [MainGateway, MessagesGateway, ChannelsGateway],
})
export class GatewaysModule {}
