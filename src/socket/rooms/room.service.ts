import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from './room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinedRoomEntity } from '../joined-room/joined-room.entity';
import { UserEntity } from 'src/users/user.entity';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async createRoom(userId: number, createRoomDto: CreateRoomDto) {
    const newRoom = new RoomEntity(createRoomDto);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { manager } = queryRunner;

    try {
      const room = await manager.save(newRoom);
      const user = await manager.findOne(UserEntity, {
        where: { id: userId },
      });

      if (!user) throw new NotFoundException('user not found !');

      await manager.insert(JoinedRoomEntity, {
        room,
        user,
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
      relations: ['users'],
    });

    if (!room) throw new NotFoundException(404, 'Room not found !!!');

    const checkUserInRoom = await this.roomRepository.findOneBy({
      id: roomId,
      users: {
        id: userId,
      },
    });

    if (!checkUserInRoom) throw new NotFoundException('User not in room !!!');

    if (deleteUsers) {
      room.users = room.users.filter((u) => !users.includes(u.id));
    } else {
      const listUser = await this.userRepository.findBy({ id: In(users) });
      const newUsers = listUser.filter(
        (user) => !room.users.some((u) => u.id === user.id),
      );

      room.users = [...room.users, ...newUsers];
    }

    return await this.roomRepository.save({ ...room, ...updateRoom });
  }
}
