import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from 'src/aws-s3/s3.service';
import { CategoryEntity } from 'src/categories/category.entity';
import { UserEntity } from 'src/users/user.entity';
import { BookController } from './book.controller';
import { BookEntity } from './book.entity';
import { BookService } from './book.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity, UserEntity, CategoryEntity])],
  providers: [BookService, S3Service],
  controllers: [BookController],
})
export class BookModule {}
