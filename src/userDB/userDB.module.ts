import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDBController } from './userDB.controller';
import { UserDBEntity } from './userDB.entity';
import { UserDBService } from './userDB.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserDBEntity])],
  controllers: [UserDBController],
  providers: [UserDBService],
})
export class UserDBModule {}
