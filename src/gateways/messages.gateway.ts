import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS, SOCKET_EMIT } from 'src/common/events';
import { MessageDTO } from 'src/messages/dto';

@WebSocketGateway({ transports: ['websocket'] })
export class MessagesGateway {
  @WebSocketServer() server: Server;

  @OnEvent(EVENTS.USER_MESSAGES.SEND)
  handleMessageSend(payload: MessageDTO) {
    this.server.to(payload.context.chatId.toString()).emit(SOCKET_EMIT.USER_MESSAGES.SEND, payload);
  }

  @OnEvent(EVENTS.USER_MESSAGES.DELETE)
  handleMessageDelete(payload: MessageDTO) {
    this.server.to(payload.context.chatId.toString()).emit(SOCKET_EMIT.USER_MESSAGES.DELETE, payload);
  }
}
