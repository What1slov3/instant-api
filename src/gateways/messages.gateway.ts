import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { MessageDTO } from '../messages/dto';
import { EMITTER_EVENTS } from 'common/emitter.events';
import { SOCKET_EVENTS } from 'common/socket.events';
import { MessageModel } from 'messages/message.model';

@WebSocketGateway({ transports: ['websocket'] })
export class MessagesGateway {
  @WebSocketServer() server: Server;

  @OnEvent(EMITTER_EVENTS.USER_MESSAGES.SEND)
  handleMessageSend(payload: MessageModel) {
    this.server.to(payload.chatId.toString()).emit(SOCKET_EVENTS.USER_MESSAGES.SEND, new MessageDTO(payload).get());
  }

  @OnEvent(EMITTER_EVENTS.USER_MESSAGES.DELETE)
  handleMessageDelete(payload: MessageModel) {
    this.server.to(payload.chatId.toString()).emit(SOCKET_EVENTS.USER_MESSAGES.DELETE, new MessageDTO(payload).get());
  }
}
