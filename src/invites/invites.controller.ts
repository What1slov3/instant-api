import { GetInviteDTO } from './dto/getInvite.dto';
import { Controller, Param } from '@nestjs/common';
import { Get, Req, UseGuards } from '@nestjs/common/decorators';
import { InvitesService } from './invites.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { GetChannelFromInviteDTO } from './dto/getChannel.dto';
import { JoinByInviteDTO } from './dto/joinByInvite.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChannelEntity } from '../channels/entities/channel.entity';
import { InviteEntity } from './entities/invites.entity';
import { InviteDTO } from './dto/invite.dto';
import { ChannelDTO } from 'channels/dto';
import { ChannelsService } from 'channels/channels.service';

@ApiTags('Invites')
@Controller('invites')
export class InvitesController {
  constructor(private readonly inviteService: InvitesService, private readonly channelsService: ChannelsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить/создать если отсутсвует ссылку-приглашение на канал' })
  @ApiOkResponse({ type: InviteEntity })
  @Get('channel/:channelId')
  @UseGuards(JwtAuthGuard)
  async getLink(@Param() param: GetInviteDTO) {
    const res = await this.inviteService.getLink(param.channelId);
    return new InviteDTO(res).get();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Пересоздать ссылку-приглашение на канал' })
  @ApiOkResponse({ type: InviteEntity })
  @Get('recreate')
  @UseGuards(JwtAuthGuard)
  async recreateLink(@Req() req: Express.Request) {
    const res = await this.inviteService.recreateLink(req.user.id);
    return new InviteDTO(res).get();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить канал из ссылки-приглашения' })
  @ApiOkResponse({ type: ChannelEntity })
  @ApiBadRequestResponse({ type: String })
  @Get(':inviteId')
  @UseGuards(JwtAuthGuard)
  async getChannel(@Param() param: GetChannelFromInviteDTO, @Req() req: Express.Request) {
    const channel = await this.inviteService.getChannelFromInvite(param.inviteId);
    const canJoin = await this.inviteService.checkCanJoin(req.user.id, channel.id);
    const membersCount = await this.channelsService.countMembers(channel.id);
    return new ChannelDTO(channel).getFromInvite({ membersCount, canJoin });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Зайти в канал по ссылке-приглашению' })
  @ApiOkResponse({ type: ChannelEntity })
  @ApiBadRequestResponse({ type: String })
  @Get('join/:inviteId')
  @UseGuards(JwtAuthGuard)
  async joinChannelByInvite(@Param() param: JoinByInviteDTO, @Req() req: Express.Request) {
    const res = await this.inviteService.joinChannelByInvite(param.inviteId, req.user.id);
    return new ChannelDTO(res).get();
  }
}
