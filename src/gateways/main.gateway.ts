import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({ transports: ['websocket'] })
export class MainGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('join')
  handleJoin(client: Socket, payload: any) {
    client.join(payload);
  }
}
