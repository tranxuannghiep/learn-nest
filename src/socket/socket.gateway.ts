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
import { CACHE_MANAGER, Inject, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { MessageService } from './messages/message.service';
import * as cookie from 'cookie';
import { CreateMessageDto } from './messages/dto/create-message.dto';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { uniq } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinedRoomEntity } from './rooms/joined-room.entity';
import { Repository } from 'typeorm';
import { MessageEntity } from './messages/message.entity';
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
    @InjectRepository(JoinedRoomEntity)
    private readonly joinedRoomRepository: Repository<JoinedRoomEntity>,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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
    if (!decodedToken || !decodedToken.id) {
      this.handleDisconnect(client);
      return;
    }
  }

  async handleDisconnect(client: Socket) {
    this.logger.warn(`Client disconnected: ${client.id}`);
    client.disconnect(true);
  }

  @SubscribeMessage('getNotifyToRoom')
  async getNotifyToRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    const decodedToken = await this.handleCheckVerify(client);
    if (!decodedToken || !decodedToken.id || !roomId) {
      this.handleDisconnect(client);
      return;
    }
    client.join(roomId);
  }

  @SubscribeMessage('connectToRoom')
  async handleConnectRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    const decodedToken = await this.handleCheckVerify(client);
    if (!decodedToken || !decodedToken.id || !roomId) {
      this.handleDisconnect(client);
      return;
    }

    const allMessages = await this.messageService.getMessageByRoom(
      decodedToken,
      Number(roomId),
    );

    client.join(roomId);
    client.emit('allMessages', allMessages);

    await this.changeUserListConnect(decodedToken.id, roomId);
    await this.handleClearNotifyMessage(decodedToken.id, roomId);
  }

  @SubscribeMessage('leaveToRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    const decodedToken = await this.handleCheckVerify(client);
    await this.changeUserListConnect(decodedToken.id, roomId, true);

    client.leave(roomId);
  }

  @SubscribeMessage('message')
  async handleEvent(
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = data;
    const decodedToken = await this.handleCheckVerify(client);

    if (!decodedToken || !decodedToken.id || !roomId) {
      this.handleDisconnect(client);
      return;
    }

    const newMessage = await this.messageService.createMessage(
      decodedToken,
      data,
    );

    this.server.to(roomId).emit('newMessage', newMessage);
    await this.handleEmitNotifyMessage(roomId, newMessage);
  }

  async handleCheckVerify(client: Socket) {
    const cookies = cookie.parse(client.request.headers.cookie || '');
    const accessToken = cookies['access_token'];

    if (!accessToken) {
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

      return decodedToken;
    } catch (error) {
      this.handleDisconnect(client);
      return;
    }
  }

  async changeUserListConnect(
    userId: number,
    roomId: string,
    isRemove?: boolean,
  ) {
    const clientList: any =
      (await this.cacheManager.get('conversations')) || {};

    if (isRemove) {
      clientList[`room_${roomId}`] = [
        ...(clientList[`room_${roomId}`] || []).filter(
          (id: number) => id != userId,
        ),
      ];
    } else {
      clientList[`room_${roomId}`] = uniq([
        ...(clientList[`room_${roomId}`] || []),
        userId,
      ]);
    }

    await this.cacheManager.set('conversations', clientList);
    return clientList[`room_${roomId}`];
  }

  async handleEmitNotifyMessage(roomId: string, newMessage: MessageEntity) {
    const clientList: any =
      (await this.cacheManager.get('conversations')) || {};

    const listUsersID = clientList[`room_${roomId}`] || [];

    await this.joinedRoomRepository
      .createQueryBuilder()
      .update(JoinedRoomEntity)
      .set({ unreadCount: () => 'unread_count + 1' })
      .where(listUsersID.length > 0 ? 'user_id NOT IN (:...userIds)' : '1=1', {
        userIds: listUsersID,
      })
      .andWhere('room_id = :roomId', { roomId })
      .execute();

    const unreadList = await this.joinedRoomRepository.find({
      where: {
        room: { id: Number(roomId) },
      },
      relations: ['user'],
      select: {
        id: true,
        unreadCount: true,
        user: {
          id: true,
        },
      },
    });

    this.server.to(roomId).emit('notifyMessage', {
      lastMessage: newMessage,
      unreadCountList: unreadList,
      roomId,
    });
  }

  async handleClearNotifyMessage(userId: number, roomId: string) {
    await this.joinedRoomRepository
      .createQueryBuilder()
      .update(JoinedRoomEntity)
      .set({ unreadCount: 0 })
      .where('user_id = :userId', { userId })
      .andWhere('room_id = :roomId', { roomId })
      .andWhere('unread_count != 0')
      .execute();

    this.server.to(roomId).emit('clearNotify', roomId);
  }
}
