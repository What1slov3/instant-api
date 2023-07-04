import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS } from 'common/socket.events';
import { GatewayConnectChatsPayload, GatewayConnectPayload } from './payloads/main.payload';

@WebSocketGateway({ transports: ['websocket'] })
export class MainGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage(SOCKET_EVENTS.CONNECT)
  handleConnect(client: Socket, payload: GatewayConnectPayload) {
    //@ts-ignore
    client.userId = payload.userId;
  }

  @SubscribeMessage(SOCKET_EVENTS.CHATS.JOIN)
  handleJoinChats(client: Socket, payload: GatewayConnectChatsPayload) {
    client.join(payload.chats);
  }
}
