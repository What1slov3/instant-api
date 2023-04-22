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

@ApiTags('Invites')
@Controller('invites')
export class InvitesController {
  constructor(private readonly inviteService: InvitesService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить/создать если отсутсвует ссылку-приглашение на канал' })
  @ApiOkResponse({ type: InviteEntity })
  @Get('channel/:channelId')
  @UseGuards(JwtAuthGuard)
  getLink(@Param() param: GetInviteDTO) {
    return this.inviteService.getLink(param.channelId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Пересоздать ссылку-приглашение на канал' })
  @ApiOkResponse({ type: InviteEntity })
  @Get('recreate')
  @UseGuards(JwtAuthGuard)
  recreateLink(@Req() req: Express.Request) {
    return this.inviteService.recreateLink(req.user._id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить/создать если отсутсвует ссылку-приглашение на канал' })
  @ApiOkResponse({ type: ChannelEntity })
  @ApiBadRequestResponse({ type: String })
  @Get(':inviteId')
  @UseGuards(JwtAuthGuard)
  getChannelsDTO(@Param() param: GetChannelFromInviteDTO) {
    return this.inviteService.getChannelFromInvite(param.inviteId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Зайти в канал по ссылке-приглашению' })
  @ApiOkResponse({ type: ChannelEntity })
  @ApiBadRequestResponse({ type: String })
  @Get('join/:inviteId')
  @UseGuards(JwtAuthGuard)
  joinChannelByInvite(@Param() param: JoinByInviteDTO, @Req() req: Express.Request) {
    return this.inviteService.joinChannelByInvite(param.inviteId, req.user._id);
  }
}
