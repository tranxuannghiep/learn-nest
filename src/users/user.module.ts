import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Module } from 'src/aws-s3/s3.module';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { BullModule } from '@nestjs/bull';
import { EmailConsumer } from './consumers/email.consumer';
import { RoomEntity } from 'src/socket/rooms/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoomEntity]),
    S3Module,
    BullModule.registerQueue({
      name: 'send-mail',
    }),
  ],
  controllers: [UserController],
  providers: [UserService, EmailConsumer],
  exports: [UserService],
})
export class UserModule {}
