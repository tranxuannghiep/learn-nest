import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RoomEntity } from '../rooms/room.entity';
import { MessageEntity } from './message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async createMessage(token: string, roomId: number, text: string) {
    const { existedRoom, existedUser } = await this.getUserAndRoom(
      token,
      roomId,
    );

    const newMessage = new MessageEntity({ text });
    newMessage.user = existedUser;
    newMessage.room = existedRoom;

    return this.messageRepository.save(newMessage);
  }

  async getMessageByRoom(token: string, roomId: number) {
    await this.getUserAndRoom(token, roomId);
    return this.messageRepository.find({
      where: { room: { id: roomId } },
      relations: ['user'],
    });
  }

  async getUserAndRoom(token: string, roomId: number) {
    const decodedToken = await this.jwtService.verifyAsync(token as string, {
      secret: '123456',
    });

    if (!decodedToken)
      throw new NotFoundException('Room not found or user is not in room.');
    const { id } = decodedToken;

    const existedRoom = await this.roomRepository.findOne({
      where: { id: roomId, users: { id: id } },
    });

    if (!existedRoom)
      throw new NotFoundException('Room not found or user is not in room.');

    const existedUser = await this.userRepository.findOneBy({ id });

    return { existedRoom, existedUser };
  }
}
