import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { EMITTER_EVENTS } from 'common/emitter.events';
import { RemoteSocketUser } from './types';
import { GatewayChannelKickUserPayload } from './payloads/channels.payload';

@WebSocketGateway({ transports: ['websocket'] })
export class ChannelsGateway {
  @WebSocketServer() server: Server;

  @OnEvent(EMITTER_EVENTS.CHANNELS.KICK_USER)
  async handleKickUser(payload: GatewayChannelKickUserPayload) {
    const clientSocket = (await this.server.fetchSockets()).find(
      (client: RemoteSocketUser) => client.userId === payload.userId,
    );
    clientSocket?.leave(payload.channelId.toString());
  }
}
