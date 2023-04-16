import IUser from 'src/users/interfaces/user.interface';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { ChannelDocument, ChannelModel } from './channel.model';
import { UserDocument, UserModel } from 'src/users/user.model';
import { ChatDocument, ChatModel } from 'src/chats/chat.model';
import { CreateChannelDTO, ChannelDTO, UpdateChannelDTO } from './dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel(ChannelModel.name) private readonly channelModel: Model<ChannelDocument>,
    @InjectModel(UserModel.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(ChatModel.name) private readonly chatModel: Model<ChatDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async createChannel(user: IUser, createChanelDTO: CreateChannelDTO) {
    const { name, iconName } = createChanelDTO;

    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      const channelId = new Types.ObjectId();
      const systemChatId = new Types.ObjectId();

      const transactionResult = await Promise.all([
        this.channelModel.create(
          [
            {
              name,
              _id: channelId,
              icon: iconName,
              members: [user._id],
              ownerId: user._id,
              chatGroups: [{ name: 'Текстовые каналы', chats: [systemChatId] }],
              systemChatId: systemChatId,
            },
          ],
          { session },
        ),
        this.chatModel.create([{ _id: systemChatId, name: 'системный', owningChannelId: channelId }], {
          session,
        }),
        this.userModel.updateOne(
          { _id: user._id },
          {
            $push: { channels: channelId },
          },
          { session, new: true },
        ),
      ]);

      await session.commitTransaction();
      await session.endSession();

      return new ChannelDTO(transactionResult[0][0].toJSON()).get();
    } catch (e) {
      await session.abortTransaction();
      await session.endSession();
      throw new InternalServerErrorException(e);
    }
  }

  async getChannels(ids: Types.ObjectId[]) {
    const channels = await this.channelModel.find({ _id: { $in: ids } });
    return channels.map((channel) => new ChannelDTO(channel.toJSON()).get());
  }

  async updateChannel(channelId: Types.ObjectId, updatingFields: UpdateChannelDTO, userId: Types.ObjectId) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      const channel = await this.channelModel.findOneAndUpdate({ ownerId: userId, channelId }, updatingFields, {
        session,
        new: true,
      });

      await session.commitTransaction();
      await session.endSession();

      return new ChannelDTO(channel.toJSON()).get();
    } catch (e) {
      await session.abortTransaction();
      await session.endSession();
      throw new InternalServerErrorException(e);
    }
  }
}
