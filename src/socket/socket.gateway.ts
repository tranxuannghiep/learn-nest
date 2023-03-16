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
import { CreateMessageDto } from './messages/dto/create-message.dto';
import { JwtService } from '@nestjs/jwt';

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
  constructor(
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('SocketGateway');

  afterInit() {
    this.logger.warn('Socket server initialized');
  }

  async handleConnection(client: Socket) {
    this.logger.warn(`Client connected: ${client.id}`);
    this.server.emit('newConnection', `Client connected: ${client.id}`);

    const decodedToken = await this.handleCheckVerify(client);
    const { roomId } = client.handshake.query;

    const allMessages = await this.messageService.getMessageByRoom(
      decodedToken,
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
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = client.handshake.query;
    const decodedToken = await this.handleCheckVerify(client);

    const newMessage = await this.messageService.createMessage(
      decodedToken,
      Number(roomId as string),
      data,
    );
    this.server.to(roomId).emit('newMessage', newMessage);
  }

  async handleCheckVerify(client: Socket) {
    const cookies = cookie.parse(client.request.headers.cookie || '');
    const accessToken = cookies['access_token'];
    const { roomId } = client.handshake.query;
    if (!accessToken || !roomId) {
      this.handleDisconnect(client);
      return;
    }
    try {
      const decodedToken = await this.jwtService.verifyAsync(
        accessToken as string,
        {
          secret: '123456',
        },
      );
      if (!decodedToken) {
        this.handleDisconnect(client);
        return;
      }
      return decodedToken;
    } catch (error) {
      this.handleDisconnect(client);
      return;
    }
  }
}
