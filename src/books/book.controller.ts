import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/utils/types';
import {
  FileTypeValidator,
  MaxFileSizeValidator,
} from 'src/utils/validator.image';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { BookQueryDto } from './dto/query-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookSwagger } from './swagger/create-book.swagger';
import { UpdateBookSwagger } from './swagger/update-book.swagger';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const MB = 1e6;

@Controller('book')
@ApiTags('Book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @ApiTags('Seller')
  @ApiBearerAuth('Bearer Token')
  @ApiCookieAuth('access_token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateBookSwagger,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.Seller, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor('file', 5))
  async createBook(
    @Req() req: Request,
    @Body() bookDto: CreateBookDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1 * MB }),
          new FileTypeValidator({ fileType: 'image' }),
        ],
        fileIsRequired: false,
      }),
    )
    files?: Array<Express.Multer.File>,
  ) {
    const { id } = req.user;
    const book = await this.bookService.createBook(bookDto, id, files);
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

  @ApiTags('Seller')
  @ApiBearerAuth('Bearer Token')
  @ApiCookieAuth('access_token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateBookSwagger,
  })
  @Patch(':id')
  @Roles(Role.Seller)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor('file', 5))
  async updateBook(
    @Param('id') id: number,
    @Body() updateBookDto: UpdateBookDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1 * MB }),
          new FileTypeValidator({ fileType: 'image' }),
        ],
        fileIsRequired: false,
      }),
    )
    files?: Array<Express.Multer.File>,
  ) {
    return this.bookService.updateBook(id, updateBookDto, files);
  }

  @Get(':id')
  async getBookDetail(@Param('id') id: number) {
    return this.bookService.getBookDetail(id);
  }
}
