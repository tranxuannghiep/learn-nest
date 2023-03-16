import { Module } from '@nestjs/common';
import { S3Module } from 'src/aws-s3/s3.module';
import { UserModule } from 'src/users/user.module';
import { MessageModule } from './messages/message.module';
import { SocketGateWay } from './socket.gateway';

@Module({
  imports: [UserModule, MessageModule, S3Module],
  controllers: [],
  providers: [SocketGateWay],
})
export class SocketModule {}
