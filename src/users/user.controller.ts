import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
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
  createUser(@Body() user: UserDto, @Res() res: Response) {
    const { username, password } = user;
    res.status(HttpStatus.CREATED).json({
      username,
      password,
    });
  }
}
