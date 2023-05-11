import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ChatsService } from './chats.service';
import { CreateChatDTO, GetChatsDTO, GetChatsForChannelDTO } from './dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatEntity } from './entities/chat.entity';
import { UpdateChatDTO, UpdateChatParamDTO } from './dto/updateChat.dto';

@ApiTags('Chats')
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание нового чата' })
  @ApiOkResponse({ type: ChatEntity })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createChat(@Body() body: CreateChatDTO) {
    return this.chatsService.createChat(body);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение чатов по ID' })
  @ApiOkResponse({ type: [ChatEntity] })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getChats(@Query() query: GetChatsDTO) {
    return this.chatsService.getChats(query.ids);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение чатов для определенного чата' })
  @ApiOkResponse({ type: [ChatEntity] })
  @UseGuards(JwtAuthGuard)
  @Get('forChannel')
  async getChatsForChannel(@Query() query: GetChatsForChannelDTO) {
    return this.chatsService.getChatsForChannel(query.channelId);
  }

  @ApiOperation({ summary: 'Обновление данных и настроек чата' })
  @ApiOkResponse({ type: ChatEntity })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Patch(':chatId')
  async updateChat(@Param() param: UpdateChatParamDTO, @Body() body: UpdateChatDTO, @Req() req: Express.Request) {
    return this.chatsService.updateChat(param.chatId, body, req.user);
  }
}
