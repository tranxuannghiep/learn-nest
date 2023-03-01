import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  SubscribeMessage,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('SocketGateway');

  afterInit() {
    this.logger.warn('Socket server initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.warn(`Client connected: ${client.id}`);
    this.server.emit('newConnection', `Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.warn(`Client disconnected: ${client.id}`);
    client.disconnect(true);
  }

  @SubscribeMessage('message')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    console.log(data);
    // client biết đã gửi success
    client.emit('reply', 'Server received your message: ' + data);

    // phản hồi client
    client.send('hello from server');
    return data;
  }
}
