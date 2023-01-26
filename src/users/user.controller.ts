import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserDto } from './user.dto';

@Controller('users')
export class UserController {
  @Get()
  getAllUsers() {
    return [
      {
        name: 'David',
        age: 12,
      },
      {
        name: 'Piker',
        age: 18,
      },
    ];
  }

  @Post()
  createUser(@Body() user: UserDto): UserDto {
    user.id = 1;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    const userReal = UserDto.plainToClass(user);
    return userReal;
  }
}
