import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookEntity } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UserDBEntity } from 'src/userDB/userDB.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepositoty: Repository<BookEntity>,
    @InjectRepository(UserDBEntity)
    private readonly userRepository: Repository<UserDBEntity>,
  ) {}

  async createBook(bookDto: CreateBookDto, id: number) {
    const book = await this.bookRepositoty.create(bookDto);
    const user = await this.userRepository.findOneBy({ id });
    book.seller = user;
    return this.bookRepositoty.save(book);
  }

  async getAll() {
    return this.bookRepositoty.find({
      relations: {
        seller: true,
      },
      select: {
        seller: {
          firstname: true,
          lastname: true,
          id: true,
          username: true,
        },
      },
    });
  }
}
