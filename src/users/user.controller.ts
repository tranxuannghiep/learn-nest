import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { UserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  getAllUsers() {
    // return [
    //   {
    //     name: 'David',
    //     age: 12,
    //   },
    //   {
    //     name: 'Piker',
    //     age: 18,
    //   },
    // ];
    return this.logger.log();
  }

  @Post()
  createUser(@Body() user: UserDto): UserDto {
    return this.userService.createUser(user);
  }
}
