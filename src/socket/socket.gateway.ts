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
import { MessageService } from './messages/message.service';
import * as cookie from 'cookie';
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
    exposedHeaders: 'Set-Cookie',
  },
})
export class SocketGateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messageService: MessageService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('SocketGateway');

  afterInit() {
    this.logger.warn('Socket server initialized');
  }

  async handleConnection(client: Socket) {
    this.logger.warn(`Client connected: ${client.id}`);
    this.server.emit('newConnection', `Client connected: ${client.id}`);
    const { roomId } = client.handshake.query;
    const cookies = cookie.parse(client.request.headers.cookie || '');
    const accessToken = cookies['access_token'];

    if (!accessToken || !roomId) {
      this.handleDisconnect(client);
      return;
    }

    const allMessages = await this.messageService.getMessageByRoom(
      (accessToken as string) || '',
      Number(roomId as string),
    );

    client.join(roomId);

    client.emit('allMessages', allMessages);
  }

  handleDisconnect(client: Socket) {
    this.logger.warn(`Client disconnected: ${client.id}`);
    const { roomId } = client.handshake.query;

    if (!roomId) return;

    client.leave(roomId as string);
    client.disconnect(true);
  }

  @SubscribeMessage('message')
  async handleEvent(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = client.handshake.query;
    const cookies = cookie.parse(client.request.headers.cookie || '');
    const accessToken = cookies['access_token'];

    if (!accessToken || !roomId) {
      this.handleDisconnect(client);
      return;
    }

    const newMessage = await this.messageService.createMessage(
      (accessToken as string) || '',
      Number(roomId as string),
      message,
    );
    this.server.to(roomId).emit('newMessage', newMessage);
  }
}
