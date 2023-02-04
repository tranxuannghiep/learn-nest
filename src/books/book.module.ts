import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/categories/category.entity';
import { UserDBEntity } from 'src/userDB/userDB.entity';
import { BookController } from './book.controller';
import { BookEntity } from './book.entity';
import { BookService } from './book.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity, UserDBEntity, CategoryEntity]),
  ],
  providers: [BookService],
  controllers: [BookController],
})
export class BookModule {}
