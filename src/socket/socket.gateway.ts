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

// interface MessageType {
//   userId: number;
//   text: string;
//   displayName: string;
//   createAt: string;
//   photoUrl: string | null;
// }

@WebSocketGateway({
  cors: {
    origin: '*',
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
    const { token } = client.handshake.headers;
    const { roomId } = client.handshake.query;
    if (!token || !roomId) {
      this.handleDisconnect(client);
      return;
    }

    const allMessages = await this.messageService.getMessageByRoom(
      (token as string) || '',
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
    const { token } = client.handshake.headers;
    const { roomId } = client.handshake.query;

    if (!token || !roomId) {
      this.handleDisconnect(client);
      return;
    }

    const newMessage = await this.messageService.createMessage(
      (token as string) || '',
      Number(roomId as string),
      message,
    );
    this.server.to(roomId).emit('newMessage', newMessage);
  }
}
