import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ChatsService } from './chats.service';
import { ChatDTO, CreateChatDTO, GetChatsDTO, GetChatsForChannelDTO } from './dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatEntity } from './entities/chat.entity';
import { UpdateChatDTO, UpdateChatParamDTO } from './dto/updateChat.dto';
import { ChatGroupDTO } from './dto/chatGroup.dto';

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
    const res = await this.chatsService.createChat(body);
    return new ChatDTO(res).get();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение чатов по ID' })
  @ApiOkResponse({ type: [ChatEntity] })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getChats(@Query() query: GetChatsDTO) {
    const res = await this.chatsService.getChats(query.ids);
    return res.map((chat) => new ChatDTO(chat).get());
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение чатов для определенного чата' })
  @ApiOkResponse({ type: [ChatEntity] })
  @UseGuards(JwtAuthGuard)
  @Get('forChannel')
  async getChatsForChannel(@Query() query: GetChatsForChannelDTO) {
    const res = await this.chatsService.getChatsForChannel(query.channelId);
    return res.map((chatGroup) => {
      chatGroup.chats = chatGroup.chats.map((chat) => chat.id);
      return new ChatGroupDTO(chatGroup).get();
    });
  }

  @ApiOperation({ summary: 'Обновление данных и настроек чата' })
  @ApiOkResponse({ type: ChatEntity })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Patch(':chatId')
  async updateChat(@Param() param: UpdateChatParamDTO, @Body() body: UpdateChatDTO) {
    const res = (await this.chatsService.updateChat(param.chatId, body)).raw[0];
    return new ChatDTO(res).get();
  }
}
