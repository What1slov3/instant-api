import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ChatsService } from './chats.service';
import { CreateChatDTO, GetChatsDTO, GetChatsForChannelDTO } from './dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatEntity } from './entities/chat.entity';

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
  @ApiOperation({ summary: 'Получение чатов для определенного канала' })
  @ApiOkResponse({ type: [ChatEntity] })
  @UseGuards(JwtAuthGuard)
  @Get('forChannel')
  async getChatsForChannel(@Query() query: GetChatsForChannelDTO) {
    return this.chatsService.getChatsForChannel(query.channelId);
  }
}
