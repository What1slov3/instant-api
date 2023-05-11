import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ChatDocument, ChatModel } from './chat.model';
import mongoose, { Model, Types } from 'mongoose';
import { ChannelDocument, ChannelModel } from '../channels/channel.model';
import { ChatDTO, CreateChatDTO } from './dto';
import { UpdateChatDTO } from './dto/updateChat.dto';
import IUser from 'users/interfaces/user.interface';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(ChatModel.name) private readonly chatModel: Model<ChatDocument>,
    @InjectModel(ChannelModel.name) private readonly channelModel: Model<ChannelDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async createChat(data: CreateChatDTO) {
    const { owningChannelId: channelOwnerId, name, chatGroupId } = data;

    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      const newChatId = new Types.ObjectId();

      const channel = await this.channelModel.findOneAndUpdate(
        { _id: channelOwnerId, 'chatGroups._id': chatGroupId },
        { $push: { 'chatGroups.$.chats': newChatId } },
      );

      if (!channel) {
        throw new BadRequestException('Not exist chat group');
      }

      const chat = await this.chatModel.create([{ _id: newChatId, name, owningChannelId: channelOwnerId }], {
        session,
      });

      await session.commitTransaction();
      await session.endSession();

      return new ChatDTO(chat[0].toJSON()).get();
    } catch (e) {
      await session.abortTransaction();
      await session.endSession();
      throw new InternalServerErrorException(e);
    }
  }

  async getChats(ids: Types.ObjectId[]) {
    const chats = await this.chatModel.find({ _id: { $in: ids } });
    return chats.map((chat) => new ChatDTO(chat.toJSON()).get());
  }

  async getChatsForChannel(channelId: Types.ObjectId) {
    const chats = await this.chatModel.find({ channelOwner: channelId });
    return chats.map((chat) => new ChatDTO(chat.toJSON()).get());
  }

  async updateChat(chatId: Types.ObjectId, data: UpdateChatDTO, user: IUser) {
    const channel = await this.channelModel.find({ ownerId: user._id });

    if (!channel) {
      throw new ForbiddenException();
    }

    const chat = await this.chatModel.findOneAndUpdate({ _id: chatId }, data, {
      new: true,
    });

    return new ChatDTO(chat.toJSON()).get();
  }
}
