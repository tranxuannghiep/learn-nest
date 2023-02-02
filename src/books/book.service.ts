import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookEntity } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepositoty: Repository<BookEntity>,
  ) {}

  async createBook(bookDto: CreateBookDto) {
    const book = await this.bookRepositoty.create(bookDto);
    return this.bookRepositoty.save(book);
  }

  async getAll() {
    return this.bookRepositoty.find({
      relations: ['seller'],
    });
  }
}
