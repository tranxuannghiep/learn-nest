import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/users/user.module';
import { MessageModule } from './messages/message.module';
import { JoinedRoomEntity } from './rooms/joined-room.entity';
import { SocketGateWay } from './socket.gateway';

@Module({
  imports: [
    UserModule,
    MessageModule,
    TypeOrmModule.forFeature([JoinedRoomEntity]),
  ],
  controllers: [],
  providers: [SocketGateWay, JwtService],
})
export class SocketModule {}
