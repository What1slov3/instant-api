import { Module } from '@nestjs/common';
import { MainGateway } from './main.gateway';
import { MessagesGateway } from './messages.gateway';

@Module({
  providers: [MainGateway, MessagesGateway],
})
export class GatewaysModule {}
