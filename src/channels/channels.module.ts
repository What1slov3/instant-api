import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { ChannelModel, ChannelSchema } from './channel.model';
import { UserModel, UserSchema } from '../users/user.model';
import { ChatModel, ChatSchema } from '../chats/chat.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ChannelModel.name, schema: ChannelSchema }]),
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: ChatModel.name, schema: ChatSchema }]),
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule {}
