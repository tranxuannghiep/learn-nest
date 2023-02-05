import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(newCategory);
    } catch (error) {
      if (error.errno === 1062)
        throw new ConflictException('Category already exists');
      else throw new InternalServerErrorException();
    }
  }

  async getAll() {
    return this.categoryRepository.find({
      relations: { books: true },
      select: {
        books: {
          id: true,
          title: true,
        },
      },
    });
  }
}
