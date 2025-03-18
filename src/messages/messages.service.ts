import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageDocument, MessageModel } from './message.model';
import { DeleteMessageDTO, SendMessageDTO, GetHistoryDTO } from './dto';
import { ChatsService } from 'chats/chats.service';
import { EditMessageDTO } from './dto/editMessage.dto';
import type { MessageMeta } from './interfaces/message.interface';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(MessageModel.name) private readonly messageModel: Model<MessageDocument>,
    private readonly chatsService: ChatsService,
  ) {}

  async createMessage(data: SendMessageDTO, senderId: string, meta?: MessageMeta) {
    const { content, chatId } = data;

    const chat = await this.chatsService.getChats([chatId]);

    if (chat.length) {
      const message = await this.messageModel.create({ senderId, content, chatId, meta });

      return message.toJSON();
    }

    throw new BadRequestException('Not existing chat');
  }

  async deleteMessage(data: DeleteMessageDTO) {
    const { _id } = data;

    const message = (await this.messageModel.findOneAndDelete({ _id }))?.toJSON();

    if (!message) {
      throw new BadRequestException('Not existing message');
    }

    return message;
  }

  async editMessage(data: EditMessageDTO) {
    const { _id, content } = data;

    const message = (await this.messageModel.findByIdAndUpdate(_id, { $set: { content } }, { new: true }))?.toJSON();

    if (!message) {
      throw new BadRequestException('Not existing message');
    }

    return message;
  }

  async getHistory(data: GetHistoryDTO) {
    const { chatId, offset, limit } = data;

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
