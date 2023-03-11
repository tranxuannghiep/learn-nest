import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/user.entity';
import { DataSource, In, Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomEntity } from './room.entity';

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
      const user = await manager.findOne(UserEntity, {
        where: { id: userId },
      });

      if (!user) throw new NotFoundException('user not found !');
      newRoom.users = [user];
      await manager.save(newRoom);

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
    } else if (users) {
      const listUser = await this.userRepository.findBy({ id: In(users) });
      const newUsers = listUser.filter(
        (user) => !room.users.some((u) => u.id === user.id),
      );

      room.users = [...room.users, ...newUsers];
    }

    return await this.roomRepository.save({ ...room, ...updateRoom });
  }

  async getListRoom(userId: number) {
    return this.roomRepository.find({
      where: {
        users: { id: userId },
      },
    });
  }
}
