import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateChannelDTO, GetChannelMembersDTO, UpdateChannelDTO } from './dto';
import { KickUserDTO } from './dto/kickUser.dto';
import { EMITTER_EVENTS } from 'common/emitter.events';
import { ChannelEntity } from './entities/db/channel.entity';
import { ChannelMemberEntity } from 'channels/entities/db/channelMember.entity';
import { ChatsService } from 'chats/chats.service';
import { PermissionsService } from 'permissions/permissions.service';
import { EPermissions } from 'permissions/permissions';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(ChannelEntity) private readonly channelRepository: Repository<ChannelEntity>,
    @InjectRepository(ChannelMemberEntity) private readonly channelMemberEntity: Repository<ChannelMemberEntity>,
    private readonly chatsService: ChatsService,
    private readonly permissionsService: PermissionsService,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createChannel(userId: string, createChanelDTO: CreateChannelDTO) {
    const { name, iconName } = createChanelDTO;

    return await this.dataSource.transaction(async (transactionalEntityManager) => {
      const channel = this.channelRepository.create({
        icon: iconName,
        ownerId: userId,
        name,
      });
      const savedChannelEntity = await transactionalEntityManager.save(channel);

      const chatGroup = await this.chatsService.createChatGroup(
        process.env.BASE_CHAT_GROUP_NAME,
        savedChannelEntity.id,
        false,
      );
      const savedChatGroupEntity = await transactionalEntityManager.save(chatGroup);

      const chat = await this.chatsService.createChat(
        { chatGroupId: savedChatGroupEntity.id, name: process.env.BASE_CHAT_NAME },
        false,
      );
      const savedChatEntity = await transactionalEntityManager.save(chat);

      await transactionalEntityManager.update(
        ChannelEntity,
        { id: savedChannelEntity.id },
        { systemChatId: savedChatEntity.id },
      );

      const member = await this.addChannelMember(userId, savedChannelEntity.id, false);
      await transactionalEntityManager.save(member);

      await this.permissionsService.setPermissions({
        context: 'channel',
        contextId: channel.id,
        permissions: EPermissions['OWNER'],
        userId,
      });

      return { ...savedChannelEntity, systemChatId: savedChatEntity.id };
    });
  }

  async getChannels(ids: string[]) {
    const channels = await this.channelRepository.find({
      where: {
        id: In(ids),
      },
    });

    return channels;
  }

  async updateChannel(channelId: string, data: UpdateChannelDTO) {
    const channel = await this.dataSource
      .createQueryBuilder()
      .update(ChannelEntity)
      .set(data)
      .where('id = :channelId', { channelId })
      .returning('*')
      .updateEntity(true)
      .execute();

    return channel.raw[0];
  }

  async getMembers(data: GetChannelMembersDTO) {
    const members = await this.channelMemberEntity.find({
      where: {
        channelId: data.channelId,
      },
      relations: {
        user: Boolean(data.withProfiles),
      },
    });

    return members.map((member) => (data.withProfiles ? member.user : member.userId));
  }

  async addChannelMember(userId: string, channelId: string, save: boolean = true) {
    const entity = this.channelMemberEntity.create({ channelId, userId });
    if (save) {
      await this.channelMemberEntity.save(entity);
    }

    return entity;
  }

  async getMember(channelId: string, userId: string, withProfile = false) {
    const member = await this.channelMemberEntity.findOne({
      where: {
        userId,
        channelId,
      },
      relations: {
        user: Boolean(withProfile),
      },
    });

    return member;
  }

  async kickUser(data: KickUserDTO) {
    const { userId, channelId } = data;

    const joinedTables = await this.dataSource
      .createQueryBuilder(ChannelMemberEntity, 'cm')
      .leftJoinAndSelect('cm.channel', 'channel', 'channel.id = :channelId AND channel.ownerId != :userId', {
        channelId,
        userId,
      })
      .where('cm.userId = :userId AND cm.channelId = :channelId', { userId, channelId })
      .getOne();

    if (joinedTables?.channel) {
      await this.channelMemberEntity.delete({ userId, channelId });
    }

    return joinedTables;
  }

  async leaveChannel(userId: string, channelId: string) {
    const query = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(ChannelMemberEntity)
      .where('userId = :userId AND channelId = :channelId', { userId, channelId })
      .execute();

    return query.affected;
  }

  async countMembers(channelId: string) {
    const count = await this.channelMemberEntity.count({ where: { channelId } });
    return count;
  }
}
