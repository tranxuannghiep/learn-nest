import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDBDto } from './userDB.dto';
import { UserDBEntity } from './userDB.entity';

@Injectable()
export class UserDBService {
  constructor(
    @InjectRepository(UserDBEntity)
    private readonly userDBRepositoty: Repository<UserDBEntity>,
  ) {}

  async save(userDBDto: UserDBDto): Promise<UserDBDto> {
    const saveUserDB = await this.userDBRepositoty.save(userDBDto);
    return UserDBDto.plainToInstance(saveUserDB);
  }
}
