import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Module } from 'src/aws-s3/s3.module';
import { UserDBController } from './userDB.controller';
import { UserDBEntity } from './userDB.entity';
import { UserDBService } from './userDB.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserDBEntity]), S3Module],
  controllers: [UserDBController],
  providers: [UserDBService],
  exports: [UserDBService],
})
export class UserDBModule {}
