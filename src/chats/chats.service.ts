import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { CreateChatDTO } from './dto';
import { UpdateChatDTO } from './dto/updateChat.dto';
import { ChatEntity, ChatGroupEntity } from './entities/db';
import IUser from 'users/interfaces/user.interface';
import { IChatStat } from './interfaces/chatStat.interface';
import { ChatStatEntity } from './entities';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatEntity) private readonly chatRepository: Repository<ChatEntity>,
    @InjectRepository(ChatGroupEntity) private readonly chatGroupRepository: Repository<ChatGroupEntity>,
    @InjectRepository(ChatStatEntity) private readonly chatStatRepository: Repository<ChatStatEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async createChat(data: CreateChatDTO, save: boolean = true) {
    const { name, chatGroupId } = data;

    const entity = this.chatRepository.create({ name, chatGroupId });

    if (save) {
      await this.dataSource.transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.save(entity);

        // const chatStat = this.createChatStat(chat.id);
        // await transactionalEntityManager.save(chatStat);
      });
    }

    return entity;
  }

  async createChatGroup(name: string, owningChannelId: string, save: boolean = true) {
    const entity = this.chatGroupRepository.create({ name, owningChannelId });

    if (save) {
      await this.dataSource.transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.save(entity);
      });
    }

    return entity;
  }

  async getChats(ids: string[]) {
    const chats = await this.chatRepository.find({
      where: {
        id: In(ids),
      },
    });

    return chats;
  }

  async getChatsForChannel(channelId: string) {
    return await this.dataSource
      .createQueryBuilder()
      .select(['cg.id', 'cg.name', 'cg.owningChannelId'])
      .from(ChatGroupEntity, 'cg')
      .leftJoinAndSelect('cg.chats', 'c', 'c.chatGroupId = cg.id')
      .where('cg.owningChannelId = :channelId', { channelId })
      .getMany();
  }

  async updateChat(chatId: string, data: UpdateChatDTO, transaction?: EntityManager) {
    const entity = await (transaction ? transaction : this.dataSource)
      .createQueryBuilder()
      .update(ChatEntity)
      .set(data)
      .where('id = :chatId', { chatId })
      .returning('*')
      .updateEntity(true)
      .execute();

    return entity;
  }

  async createChatStat(chatId: string, save: boolean = true) {
    const entity = this.chatStatRepository.create({ chatId });

    if (save) {
      await this.chatStatRepository.save(entity);
    }

    return entity;
  }

  async updateChatStat(chatId: string, data: Partial<IChatStat>, transaction?: EntityManager) {
    const entity = await (transaction ? transaction : this.dataSource)
      .createQueryBuilder()
      .update(ChatEntity)
      .set(data)
      .where('id = :chatId', { chatId })
      .returning('*')
      .updateEntity(true)
      .execute();

    return entity;
  }
}
