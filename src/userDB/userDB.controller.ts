import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { S3Service } from 'src/aws-s3/s3.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Role } from 'src/utils/types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDBService } from './userDB.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
import { v4 as uuidv4 } from 'uuid';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('userDB')
export class UserDBController {
  constructor(
    private readonly userDBService: UserDBService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() user: CreateUserDto) {
    const userDB = await this.userDBService.createUser(user);
    return { data: userDB };
  }

  @Get()
  async getAll(@Query() paginationQuery: PaginationQueryDto) {
    const userList = await this.userDBService.getAll(paginationQuery);
    return { data: userList };
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    const user = await this.userDBService.getUserById(id);
    return { data: user };
  }

  @Put(':id')
  async updateUserById(
    @Param('id') id: number,
    @Body() dataUpdate: UpdateUserDto,
  ) {
    return this.userDBService.updateUserById(id, dataUpdate);
  }

  @Delete(':id')
  @Roles(Role.Customer)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteUserById(@Param('id') id: number) {
    await this.userDBService.deleteUserById(id);
    return { message: 'delete successfully' };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1 * 1e6 }),
          new FileTypeValidator({ fileType: 'image' }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    const key =
      file.fieldname +
      '-' +
      uuidv4().slice(0, 10) +
      path.extname(file.originalname);
    return this.s3Service.uploadFile(file, key);
  }
}
