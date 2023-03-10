import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { S3Service } from 'src/aws-s3/s3.service';
import { CategoryEntity } from 'src/categories/category.entity';
import { UserEntity } from 'src/users/user.entity';
import { In, Repository } from 'typeorm';
import { BookEntity } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { BookQueryDto } from './dto/query-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { difference, intersection } from 'lodash';
import { Cache } from 'cache-manager';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepositoty: Repository<BookEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly s3Service: S3Service,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async createBook(
    bookDto: CreateBookDto,
    id: number,
    files?: Array<Express.Multer.File>,
  ) {
    const { categories, ...bookInputDetail } = bookDto;
    let newFiles: ManagedUpload.SendData[] = [];
    const book = new BookEntity(bookInputDetail);

    if (files) {
      newFiles = await Promise.all(
        files.map((file) => this.s3Service.uploadFile(file)),
      );
      const listImage = newFiles.map((file) => file.Location);
      book.images = [...listImage];
    }

    const user = await this.userRepository.findOneBy({ id });
    const searchCategories = await this.categoryRepository.findBy({
      id: In(categories),
    });
    book.seller = user;
    book.categories = searchCategories;
    return await this.bookRepositoty.save(book).catch(async (error) => {
      await Promise.all(
        newFiles.map((file) => this.s3Service.deleteFile(file.Key)),
      );
      throw error;
    });
  }

  async getAll(bookQueryDto: BookQueryDto) {
    const { limit = 10, page = 1, seller, categories } = bookQueryDto;

    const cachedResult = await this.cacheManager.get('books');
    if (cachedResult) return cachedResult;

    const res = await this.bookRepositoty.find({
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

    await this.cacheManager.set('books', res);
    return res;
  }

  async updateBook(
    id: number,
    updateBookDto: UpdateBookDto,
    files?: Array<Express.Multer.File>,
  ) {
    const { images, categories, ...bookUpdate } = updateBookDto;
    const book = await this.bookRepositoty.findOneBy({ id });
    if (!book) {
      throw new NotFoundException();
    }
    const currentBookImages = book.images ? [...book.images] : [];

    const imagesUpdate = images
      ? intersection(images, currentBookImages)
      : [...currentBookImages];

    const oldListImage = [...currentBookImages];
    let newFiles: ManagedUpload.SendData[] = [];

    if (categories) {
      const newCategories = await this.categoryRepository.findBy({
        id: In(categories),
      });
      book.categories = newCategories;
    }

    if (files) {
      newFiles = await Promise.all(
        files.map((file) => this.s3Service.uploadFile(file)),
      );
      const listImage = newFiles.map((file) => file.Location);
      book.images = [...imagesUpdate, ...listImage];
    } else {
      book.images = [...imagesUpdate];
    }

    return await this.bookRepositoty
      .save({ ...book, ...bookUpdate })
      .then(async (res) => {
        const listDeleteKey = difference(oldListImage, imagesUpdate).map(
          (image) => new URL(image).pathname.slice(1),
        );

        await Promise.all(
          listDeleteKey.map((file) => this.s3Service.deleteFile(file)),
        );
        return res;
      })
      .catch(async (error) => {
        await Promise.all(
          newFiles.map((file) => this.s3Service.deleteFile(file.Key)),
        );
        throw error;
      });
  }

  async getBookDetail(id: number) {
    const book = await this.bookRepositoty.findOne({
      where: { id },
      relations: { seller: true, categories: true },
      select: {
        seller: { id: true, firstname: true, lastname: true, username: true },
        categories: {
          id: true,
          name: true,
        },
      },
    });
    if (!book) throw new NotFoundException();
    return book;
  }
}
