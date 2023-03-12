import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/user.entity';
import { RoomEntity } from '../rooms/room.entity';
import { MessageEntity } from './message.entity';
import { MessageService } from './message.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity, UserEntity, MessageEntity])],
  controllers: [],
  providers: [MessageService, JwtService],
  exports: [MessageService],
})
export class MessageModule {}
