import {
  InternalServerErrorException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BookEntity } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UserDBEntity } from 'src/userDB/userDB.entity';
import { CategoryEntity } from 'src/categories/category.entity';
import { BookQueryDto } from './dto/query-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepositoty: Repository<BookEntity>,
    @InjectRepository(UserDBEntity)
    private readonly userRepository: Repository<UserDBEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async createBook(bookDto: CreateBookDto, id: number) {
    const { categories, ...bookInputDetail } = bookDto;

    const book = await this.bookRepositoty.create(bookInputDetail);
    const user = await this.userRepository.findOneBy({ id });

    const searchCategories = await this.categoryRepository.findBy({
      id: In(categories),
    });
    book.seller = user;
    book.categories = searchCategories;
    return await this.bookRepositoty.save(book);
    //insert not work
  }

  async getAll(bookQueryDto: BookQueryDto) {
    const { limit = 10, page = 1, seller, categories } = bookQueryDto;
    return this.bookRepositoty.find({
      relations: {
        seller: true,
        categories: true,
      },
      select: {
        seller: {
          firstname: true,
          lastname: true,
          id: true,
          username: true,
        },
        categories: {
          id: true,
          name: true,
        },
      },
      where: {
        seller: seller && {
          id: seller,
        },
        categories: categories && {
          id: In(categories),
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
