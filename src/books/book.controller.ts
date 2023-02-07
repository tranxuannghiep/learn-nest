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
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Param,
  StreamableFile,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/utils/types';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { BookQueryDto } from './dto/query-book.dto';
import { diskStorage } from 'multer';
import { createReadStream } from 'fs';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const MB = 1e6;

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

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname),
          );
        },
      }),
      fileFilter(req, file, cb) {
        const allowExtensions = ['.jpg', '.png', '.gif', '.jpeg'];
        const fileExtension = path.extname(file.originalname);
        const regex = new RegExp(`(${allowExtensions.join('|')})$`, 'i');
        if (regex.test(fileExtension)) {
          cb(null, true);
        } else {
          cb(new BadRequestException(), false);
        }
      },
    }),
  )
  async handleUpload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1 * MB }),
          new FileTypeValidator({ fileType: 'image' }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    return file;
  }

  @Get('upload/:filename')
  getFile(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    res.set({
      'Content-Type': 'text/plain',
    });
    const file = createReadStream(join(process.cwd(), 'uploads', filename));
    file.on('data', (chunk) => console.log(chunk));
    file.on('end', () => console.log('done'));
    file.on('error', (err) => {
      console.error(err);
    });
    return new StreamableFile(file);
  }
}
