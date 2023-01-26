import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
// import { UserReponsitory } from './user.repository';

@Injectable()
export class UserService {
  //   constructor(userReponsitory: UserReponsitory) {}

  createUser(user: UserDto): UserDto {
    user.id = 1;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    const userReal = UserDto.plainToInstance(user);
    return userReal;
  }
}
