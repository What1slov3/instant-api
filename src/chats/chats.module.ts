import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelModel, ChannelSchema } from 'src/channels/channel.model';
import { ChatModel, ChatSchema } from './chat.model';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ChatModel.name, schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: ChannelModel.name, schema: ChannelSchema }]),
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
