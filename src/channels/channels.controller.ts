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
} from '@nestjs/common';
import { Request } from 'express';
import { multerOptions } from '../common/configs/storage.config';
import { ChannelsService } from './channels.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateChannelDTO, GetChannelsDTO } from './dto';
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
    return this.channelsService.createChannel(req.user, { name: body.name, iconName: files.icon[0].filename });
  }

  @ApiOperation({ summary: 'Получение каналов по ID' })
  @ApiOkResponse({ type: [ChannelEntity] })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getChannels(@Query() query: GetChannelsDTO) {
    return this.channelsService.getChannels(query.ids);
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
    @Req() req: Express.Request,
  ) {
    return this.channelsService.updateChannel(
      param.channelId,
      {
        ...body,
        icon: files?.icon?.[0].filename,
        banner: files?.banner?.[0].filename,
      },
      req.user._id,
    );
  }
}
