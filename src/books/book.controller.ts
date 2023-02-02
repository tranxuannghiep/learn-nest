import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBook(@Body() bookDto: CreateBookDto) {
    const book = await this.bookService.createBook(bookDto);
    return { data: book };
  }

  @Get('all')
  async getAll() {
    return this.bookService.getAll();
  }
}
