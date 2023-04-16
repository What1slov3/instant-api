import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatDocument, ChatModel } from './../chats/chat.model';
import { MessageDocument, MessageModel } from './message.model';
import { DeleteMessageDTO, MessageDTO, SendMessageDTO, GetHistoryDTO } from './dto';
import { EVENTS } from 'src/common/events';
import type IUser from 'src/users/interfaces/user.interface';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(MessageModel.name) private readonly messageModel: Model<MessageDocument>,
    @InjectModel(ChatModel.name) private readonly chatModel: Model<ChatDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private eventEmitter: EventEmitter2,
  ) {}

  async sendMessage(messageData: SendMessageDTO, user: IUser) {
    const { content, context } = messageData;

    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      const transactionResult = await Promise.all([
        this.messageModel.create([{ senderId: user._id, content, context }], { session }),
        this.chatModel.updateOne({ _id: context.chatId }, { $inc: { 'stats.messageCount': 1 } }, { session }),
      ]);

      await session.commitTransaction();
      await session.endSession();

      const messageDTO = new MessageDTO(transactionResult[0][0].toJSON()).get();
      this.eventEmitter.emit(EVENTS.USER_MESSAGES.SEND, messageDTO);
      return messageDTO;
    } catch (e) {
      await session.abortTransaction();
      await session.endSession();
      throw new InternalServerErrorException(e);
    }
  }

  async deleteMessage(messageData: DeleteMessageDTO, userId: Types.ObjectId) {
    const { _id, context } = messageData;

    const deletingMessage = await this.messageModel.findById(messageData._id);

    if (!deletingMessage) {
      throw new BadRequestException('Not existing message');
    }
    if (deletingMessage.senderId.toString() !== userId.toString()) {
      throw new BadRequestException('You are not the sender user');
    }

    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      const transaction = await Promise.all([
        this.messageModel.findOneAndDelete({ _id }, { session }),
        this.chatModel.updateOne({ _id: context.chatId }, { $inc: { 'stats.messageCount': -1 } }, { session }),
      ]);

      await session.commitTransaction();
      await session.endSession();

      const messageDTO = new MessageDTO(transaction[0].toJSON()).get();
      this.eventEmitter.emit(EVENTS.USER_MESSAGES.DELETE, messageDTO);
      return messageDTO;
    } catch (e) {
      await session.abortTransaction();
      await session.endSession();
      throw new InternalServerErrorException(e);
    }
  }

  async getHistory(getData: GetHistoryDTO) {
    const { chatId, offset, limit } = getData;

    const chat = await this.chatModel.findOne({ _id: chatId });

    if (!chat) {
      throw new BadRequestException(`No exists chat ${chatId}`);
    }

    const history = await this.messageModel
      .find({ 'context.chatId': chatId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    return {
      history: history.map((message) => new MessageDTO(message.toJSON()).get()),
      hasMore: chat.stats.messageCount > offset + limit,
      chatId,
    };
  }
}
