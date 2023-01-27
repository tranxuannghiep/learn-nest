import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { SercurityService } from './sercurity.service';
import { UserDto } from './user.dto';
// import { UserReponsitory } from './user.repository';

@Injectable()
export class UserService {
  //   constructor(userReponsitory: UserReponsitory) {}

  constructor(
    @Inject(forwardRef(() => SercurityService))
    private readonly sercurityService: SercurityService,
  ) {}

  createUser(user: UserDto): UserDto {
    user.id = 1;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    const userReal = UserDto.plainToInstance(user);
    return userReal;
  }
}
