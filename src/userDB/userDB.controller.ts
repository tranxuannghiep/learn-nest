import { Body, Controller, Post } from '@nestjs/common';
import { UserDBDto } from './userDB.dto';
import { UserDBService } from './userDB.service';

@Controller('userDB')
export class UserDBController {
  constructor(private readonly userDBService: UserDBService) {}

  @Post()
  createUser(@Body() user: UserDBDto): Promise<UserDBDto> {
    return this.userDBService.save(user);
  }
}
