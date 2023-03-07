import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from './room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinedRoomEntity } from '../joined-room/joined-room.entity';
import { UserEntity } from 'src/users/user.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  async createRoom(userId: number, createRoomDto: CreateRoomDto) {
    const newRoom = new RoomEntity(createRoomDto);
    return await this.roomRepository.manager.transaction(async (manager) => {
      const queryRunner = manager.queryRunner;
      await queryRunner.startTransaction();
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
      }
    });
  }
}
