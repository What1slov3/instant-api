import { Body, Controller, Delete, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { DeleteMessageDTO, EditMessageDTO, GetHistoryDTO, MessageDTO, SendMessageDTO } from './dto';
import { MessagesService } from './messages.service';
import { MessageEntity } from './entities/messages.entity';
import { MessageHistoryEntity } from './entities/history.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EMITTER_EVENTS } from 'common/emitter.events';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService, private readonly eventEmitter: EventEmitter2) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отправление сообщения в чат' })
  @ApiOkResponse({ type: MessageEntity })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Post('send')
  async sendMessage(@Body() body: SendMessageDTO, @Req() req: Express.Request) {
    const res = await this.messagesService.createMessage(body, req.user.id);
    this.eventEmitter.emit(EMITTER_EVENTS.USER_MESSAGES.SEND, res);

    return new MessageDTO(res).get();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отправление сообщения из чата' })
  @ApiOkResponse({ type: MessageEntity })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteMessage(@Body() body: DeleteMessageDTO) {
    const res = await this.messagesService.deleteMessage(body);
    this.eventEmitter.emit(EMITTER_EVENTS.USER_MESSAGES.DELETE, res);

    return new MessageDTO(res).get();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Редактирование сообщения из чата' })
  @ApiOkResponse({ type: MessageEntity })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Put('edit')
  async editMessage(@Body() body: EditMessageDTO) {
    const res = await this.messagesService.editMessage(body);

    return new MessageDTO(res).get();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение истории сообщений' })
  @ApiOkResponse({ type: MessageHistoryEntity })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getHistory(@Query() query: GetHistoryDTO) {
    const res = await this.messagesService.getHistory(query);
    //@ts-ignore
    res.history = res.history.map((message) => new MessageDTO(message.toJSON()).get());

    return res;
  }
}
