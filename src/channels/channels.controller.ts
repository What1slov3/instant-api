import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  UploadedFiles,
  Req,
  UseGuards,
  Get,
  Query,
  Param,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { multerOptions } from '../common/configs/storage.config';
import { ChannelsService } from './channels.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ChannelDTO, CreateChannelDTO, GetChannelMembersDTO, GetChannelsDTO, LeaveChannelDTO } from './dto';
import { UpdateChannelDTO, UpdateChannelParamDTO } from './dto/updateChannel.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ChannelEntity } from './entities/channel.entity';
import { PermissionsGuard } from 'permissions/guards/permissions.guard';
import { RequiredPermissions } from 'permissions/decorators/permissions.decorator';
import { EPermissions } from 'permissions/permissions';
import { PermissionsContext } from 'permissions/decorators/permissionsContext.decorator';
import { KickUserDTO } from './dto/kickUser.dto';
import { UserDTO } from 'users/dto';
import { UserEntity } from 'users/entities/user.entity';

@ApiTags('Channels')
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание нового канала' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        icon: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string',
          description: 'Название канала',
        },
      },
    },
  })
  @ApiOkResponse({ type: ChannelEntity })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'icon', maxCount: 1 }], multerOptions))
  async createChannel(@Body() body: Omit<CreateChannelDTO, 'icon'>, @UploadedFiles() files, @Req() req: Request) {
    const res = await this.channelsService.createChannel(req.user.id, {
      name: body.name,
      iconName: files.icon[0].filename,
    });
    return new ChannelDTO(res).get({ members: [req.user.id] });
  }

  @ApiOperation({ summary: 'Получение каналов по ID' })
  @ApiOkResponse({ type: [ChannelEntity] })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getChannels(@Query() query: GetChannelsDTO) {
    // TODO оптимизровать запрос на уровне SQL в идеае
    let users: any[];

    if (query.withMembers) {
      users = await Promise.all(
        query.ids.map(async (channelId) => await this.channelsService.getMembers({ channelId })),
      );
    }

    const res = await this.channelsService.getChannels(query.ids);

    return res.map((channel, index) =>
      new ChannelDTO(channel).get(query.withMembers ? { members: users[index] } : null),
    );
  }

  @ApiOperation({ summary: 'Получение пользователей канала' })
  @ApiOkResponse({ type: [UserEntity] })
  @UseGuards(JwtAuthGuard)
  @Get('members')
  async getMembers(@Query() query: GetChannelMembersDTO) {
    const res = await this.channelsService.getMembers(query);
    return res.map((member) => (query.withProfiles ? new UserDTO(member).getPublic() : member));
  }

  @ApiOperation({ summary: 'Обновление данных и настроек канала' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        icon: {
          type: 'string',
          format: 'binary',
        },
        banner: {
          type: 'string',
          format: 'binary',
        },
        systemChatId: {
          type: 'string',
          description: 'ID системного чата уведомлений',
        },
        name: {
          type: 'string',
          description: 'Название канала',
        },
      },
    },
  })
  @ApiOkResponse({ type: ChannelEntity })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Patch(':channelId')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'icon', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  async updateChannel(
    @Param() param: UpdateChannelParamDTO,
    @UploadedFiles() files,
    @Body() body: Omit<UpdateChannelDTO, 'banner' | 'icon'>,
  ) {
    const res = await this.channelsService.updateChannel(param.channelId, {
      ...body,
      icon: files?.icon?.[0].filename,
      banner: files?.banner?.[0].filename,
    });
    return new ChannelDTO(res).get();
  }

  // @Permissions(EPermissions['ADMIN'])
  // @PermissionsContext('channel')
  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post('kick')
  async kickUser(@Body() body: KickUserDTO) {
    return this.channelsService.kickUser(body);
  }

  @ApiOperation({ summary: 'Выход из канала' })
  @ApiOkResponse()
  @UseGuards(JwtAuthGuard)
  @Get('leave')
  async leaveChannel(@Query() query: LeaveChannelDTO, @Req() req: Express.Request) {
    const res = await this.channelsService.leaveChannel(req.user.id, query.channelId);
    if (res) {
      return;
    }
    throw new BadRequestException();
  }
}
