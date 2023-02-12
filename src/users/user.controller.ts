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
  Patch,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { S3Service } from 'src/aws-s3/s3.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Role } from 'src/utils/types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserSwagger } from './swagger/create-user.dto';
import { UpdateUserSwagger } from './swagger/update-user.swagger';
import { UserService } from './user.service';

@ApiTags('User')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly s3Service: S3Service,
  ) {}

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateUserSwagger,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  async createUser(
    @Body() user: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1 * 1e6 }),
          new FileTypeValidator({ fileType: 'image' }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    const User = await this.userService.createUser(user, file);
    return { data: User };
  }

  @ApiQuery({ name: 'limit', type: 'int', required: false })
  @ApiQuery({ name: 'page', type: 'int', required: false })
  @Get()
  async getAll(@Query() paginationQuery: PaginationQueryDto) {
    const userList = await this.userService.getAll(paginationQuery);
    return { data: userList };
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    const user = await this.userService.getUserById(id);
    return { data: user };
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateUserSwagger,
  })
  @ApiBearerAuth('Bearer Token')
  @ApiCookieAuth('access_token')
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateUserById(
    @Req() req: Request,
    @Body() dataUpdate: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1 * 1e6 }),
          new FileTypeValidator({ fileType: 'image' }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    const { id } = req.user;
    return this.userService.updateUserById(id, dataUpdate, file);
  }

  @ApiBearerAuth('Bearer Token')
  @ApiCookieAuth('access_token')
  @ApiTags('Admin')
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteUserById(@Param('id') id: number) {
    await this.userService.deleteUserById(id);
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
    return this.s3Service.uploadFile(file);
  }

  @Patch('upload')
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
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
    @Body('key') key: string,
  ) {
    return this.s3Service.updateFile(key, file);
  }
}
