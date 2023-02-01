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
} from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDBService } from './userDB.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('userDB')
export class UserDBController {
  constructor(private readonly userDBService: UserDBService) {}

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
  async deleteUserById(@Param('id') id: number) {
    await this.userDBService.deleteUserById(id);
    return { message: 'delete successfully' };
  }
}
