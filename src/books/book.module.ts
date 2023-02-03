import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDBEntity } from 'src/userDB/userDB.entity';
import { BookController } from './book.controller';
import { BookEntity } from './book.entity';
import { BookService } from './book.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity, UserDBEntity])],
  providers: [BookService],
  controllers: [BookController],
})
export class BookModule {}
