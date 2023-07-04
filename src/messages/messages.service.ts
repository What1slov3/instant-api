import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessageDocument, MessageModel } from './message.model';
import { DeleteMessageDTO, SendMessageDTO, GetHistoryDTO } from './dto';
import { EMITTER_EVENTS } from 'common/emitter.events';
import type { MessageMeta } from './interfaces/message.interface';
import { ChatsService } from 'chats/chats.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(MessageModel.name) private readonly messageModel: Model<MessageDocument>,
    private readonly chatsService: ChatsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async sendMessage(data: SendMessageDTO, senderId: string, meta?: MessageMeta) {
    const { content, chatId } = data;

    const chat = await this.chatsService.getChats([chatId]);

    if (chat.length) {
      console.log(meta)
      const message = (await this.messageModel.create({ senderId, content, chatId, meta })).toJSON();

      this.eventEmitter.emit(EMITTER_EVENTS.USER_MESSAGES.SEND, message);

      return message;
    }

    throw new BadRequestException('Not existing chat');
  }

  async deleteMessage(data: DeleteMessageDTO) {
    const { _id } = data;

    const message = (await this.messageModel.findOneAndDelete({ _id }))?.toJSON();

    if (!message) {
      throw new BadRequestException('Not existing message');
    }

    this.eventEmitter.emit(EMITTER_EVENTS.USER_MESSAGES.DELETE, message);

    return message;
  }

  async getHistory(getData: GetHistoryDTO) {
    const { chatId, offset, limit } = getData;

    // to avoid possible performance problems, for now we use 2 queries
    // https://stackoverflow.com/questions/20348093/mongodb-aggregation-how-to-get-total-records-count/49483919#49483919
    const count = await this.messageModel.find({ chatId }).count();
    const history = await this.messageModel.find({ chatId }).sort({ createdAt: -1 }).skip(offset).limit(limit);

    return {
      history: history,
      hasMore: count > offset + limit,
      chatId,
    };
  }
}
