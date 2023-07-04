import { Injectable } from '@nestjs/common';
import { InternalServerErrorException, BadRequestException } from '@nestjs/common/exceptions';
import { MessagesService } from 'messages/messages.service';
import { channelGreetings } from 'common/greetings';
import { getRandomFromArray } from 'common/utils/getRandomFromArray';
import { InjectRepository } from '@nestjs/typeorm';
import { InviteEntity } from './entities/db/invite.entity';
import { DataSource, Repository } from 'typeorm';
import { ChannelsService } from 'channels/channels.service';

@Injectable()
export class InvitesService {
  constructor(
    @InjectRepository(InviteEntity) private readonly inviteRepository: Repository<InviteEntity>,
    private readonly channelsService: ChannelsService,
    private readonly messagesService: MessagesService,
    private readonly dataSource: DataSource,
  ) {}

  public async getLink(channelId: string) {
    try {
      const link = await this.inviteRepository.findOne({
        where: {
          channelId,
        },
      });

      if (link) {
        return link;
      }

      return await this.inviteRepository.save({ channelId });
    } catch (err) {
      if (err.code === '23503') {
        throw new BadRequestException('No channel exists with such ID');
      }
    }
  }

  public async recreateLink(channelId: string) {
    const link = await this.inviteRepository.findOne({ where: { channelId } });
    if (link) {
      await this.inviteRepository.remove(link);
      return await this.inviteRepository.save({ channelId });
    }
    throw new InternalServerErrorException();
  }

  public async getChannelFromInvite(inviteId: string) {
    const link = await this.dataSource
      .getRepository(InviteEntity)
      .createQueryBuilder('invite')
      .leftJoinAndSelect('invite.channel', 'channel')
      .where('invite.id = :inviteId', { inviteId })
      .useTransaction(false)
      .getOne();

    if (link?.channel) {
      return link.channel;
    }

    throw new BadRequestException('No invite exists for channel');
  }

  public async checkCanJoin(userId: string, channelId: string) {
    const member = await this.channelsService.getMember(channelId, userId);

    return !member;
  }

  public async joinChannelByInvite(inviteId: string, userId: string) {
    const link = await this.dataSource
      .getRepository(InviteEntity)
      .createQueryBuilder('invite')
      .leftJoinAndSelect('invite.channel', 'channel')
      .where('invite.id = :inviteId', { inviteId })
      .useTransaction(false)
      .getOne();

    if (link) {
      await this.channelsService.addChannelMember(userId, link.channelId);
      await this.messagesService.sendMessage(
        { content: { text: getRandomFromArray(channelGreetings) }, chatId: link.channel.systemChatId },
        link.channel.id,
        { type: 'greetings', data: { userId } },
      );
      return link.channel;
    }

    throw new BadRequestException();
  }
}
