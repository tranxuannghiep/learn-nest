import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RoomEntity } from '../rooms/room.entity';
import { CreateMessageDto } from './dto/create-message.dto';
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
  ) {}

  async createMessage(
    decodedToken: any,
    roomId: number,
    data: CreateMessageDto,
  ) {
    const { existedRoom, existedUser } = await this.getUserAndRoom(
      decodedToken,
      roomId,
    );

    const newMessage = new MessageEntity(data);
    newMessage.user = existedUser;
    newMessage.room = existedRoom;

    return this.messageRepository.save(newMessage);
  }

  async getMessageByRoom(decodedToken: any, roomId: number) {
    await this.verifyRoom(decodedToken, roomId);

    return this.messageRepository.find({
      where: { room: { id: roomId } },
      relations: ['user'],
    });
  }

  async verifyRoom(decodedToken: any, roomId: number) {
    const { id } = decodedToken;
    const existedRoom = await this.roomRepository.findOne({
      where: { id: roomId, users: { id: id } },
    });
    if (!existedRoom)
      throw new NotFoundException('Room not found or user is not in room.');
    return { existedRoom, userId: id };
  }

  async getUserAndRoom(decodedToken: any, roomId: number) {
    const { existedRoom, userId } = await this.verifyRoom(decodedToken, roomId);

    const existedUser = await this.userRepository.findOneBy({ id: userId });

    return { existedRoom, existedUser };
  }
}
