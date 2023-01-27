import { Module } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { SercurityService } from './sercurity.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, LoggerService, SercurityService],
})
export class UserModule {}
