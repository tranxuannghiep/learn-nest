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
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';

interface MessageType {
  userId: number;
  text: string;
  displayName: string;
  createAt: string;
  photoUrl: string | null;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('SocketGateway');
  private messages: MessageType[] = [];

  afterInit() {
    this.logger.warn('Socket server initialized');
  }

  handleConnection(client: Socket) {
    this.logger.warn(`Client connected: ${client.id}`);
    this.server.emit('newConnection', `Client connected: ${client.id}`);
    client.emit('allMessages', this.messages);
  }

  handleDisconnect(client: Socket) {
    this.logger.warn(`Client disconnected: ${client.id}`);
    client.disconnect(true);
  }

  @SubscribeMessage('message')
  async handleEvent(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    // client biết đã gửi success
    // client.emit('reply', 'Server received your message: ' + data);

    // phản hồi client
    // client.send('hello from server');

    const { token } = client.handshake.headers;
    const decodedToken = await this.jwtService.verifyAsync(token as string, {
      secret: '123456',
    });
    if (!decodedToken) return;
    const user = await this.userService.findOne(decodedToken.username);

    const newData: MessageType = {
      userId: user.id,
      text: message,
      displayName: user.firstname + ' ' + user.lastname,
      photoUrl: user.image,
      createAt: new Date().toDateString(),
    };
    this.messages.push(newData);
    this.server.emit('newMessage', newData);
  }
}
