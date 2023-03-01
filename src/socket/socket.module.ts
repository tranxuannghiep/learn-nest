import { Module } from '@nestjs/common';
import { SocketGateWay } from './socket.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [SocketGateWay],
})
export class SocketModule {}
