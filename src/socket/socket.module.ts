import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/users/user.module';
import { MessageModule } from './messages/message.module';
import { SocketGateWay } from './socket.gateway';

@Module({
  imports: [UserModule, MessageModule],
  controllers: [],
  providers: [SocketGateWay, JwtService],
})
export class SocketModule {}
