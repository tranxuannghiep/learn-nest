import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/utils/types';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { BookQueryDto } from './dto/query-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.Seller)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createBook(@Req() req: Request, @Body() bookDto: CreateBookDto) {
    const { id } = req.user;
    const book = await this.bookService.createBook(bookDto, id);
    return { data: book };
  }

  @Get('all')
  async getAll(@Query() bookQueryDto: BookQueryDto) {
    return this.bookService.getAll(bookQueryDto);
  }
}
