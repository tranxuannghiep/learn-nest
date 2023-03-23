import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JoinedRoomEntity } from './joined-room.entity';
import { RoomEntity } from './room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(JoinedRoomEntity)
    private readonly joinedRoomRepository: Repository<JoinedRoomEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async createRoom(userId: number, createRoomDto: CreateRoomDto) {
    const newRoom = new RoomEntity(createRoomDto);
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { manager } = queryRunner;

    try {
      const user = await manager.findOne(UserEntity, {
        where: { id: userId },
      });

      if (!user) throw new NotFoundException('user not found !');

      const room = await manager.save(newRoom);

      await manager.insert(JoinedRoomEntity, {
        unreadCount: 0,
        user: user,
        room: room,
      });

      await queryRunner.commitTransaction();
      return newRoom;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateRoom(
    userId: number,
    updateRoomDto: UpdateRoomDto,
    roomId: number,
  ) {
    const { users, deleteUsers, ...updateRoom } = updateRoomDto;
    const room = await this.roomRepository.findOne({
      where: {
        id: roomId,
      },
    });

    if (!room) throw new NotFoundException(404, 'Room not found !!!');

    const checkUserInRoom = await this.roomRepository.findOneBy({
      id: roomId,
      joinedRooms: {
        user: {
          id: userId,
        },
      },
    });

    if (!checkUserInRoom) throw new NotFoundException('User not in room !!!');

    if (deleteUsers) {
      await this.joinedRoomRepository
        .createQueryBuilder()
        .delete()
        .from(JoinedRoomEntity)
        .where('room.id = :roomId', { roomId })
        .andWhere('user.id IN (:users)', { users })
        .execute();
    } else if (users) {
      const usersToAdd = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.joinedRooms', 'joinedRoom')
        .where('user.id IN (:...users)', { users })
        .andWhere('joinedRoom.room_id != :roomId', { roomId })
        .getMany();

      const newJoinedRooms = usersToAdd.map((user) => {
        const joinedRoom = new JoinedRoomEntity({
          room: room,
          user: user,
          unreadCount: 0,
        });
        return joinedRoom;
      });
      await this.joinedRoomRepository.save(newJoinedRooms);
    }

    return await this.roomRepository.save({ ...room, ...updateRoom });
  }

  async getListRoom(userId: number) {
    const query = this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.joinedRooms', 'joinedRoom')
      .leftJoinAndSelect('joinedRoom.user', 'userJoined')
      .leftJoin(
        'room.messages',
        'last_message',
        'last_message.id = (SELECT MAX(m.id) FROM message m WHERE m.room_id = room.id)',
      )
      .select([
        'room.id',
        'room.name',
        'last_message.id',
        'last_message.text',
        'last_message.createdAt',
        'joinedRoom.id',
        'joinedRoom.unreadCount',
        'userJoined.id',
        'userJoined.firstname',
        'userJoined.lastname',
      ])
      .where('joinedRoom.user_id = :userId', { userId });

    return query.getMany();
  }
}
