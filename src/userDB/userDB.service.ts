import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDBEntity } from './userDB.entity';

@Injectable()
export class UserDBService {
  constructor(
    @InjectRepository(UserDBEntity)
    private readonly userDBRepositoty: Repository<UserDBEntity>,
  ) {}

  async createUser(userDBDto: CreateUserDto) {
    const user = await this.userDBRepositoty.create(userDBDto);
    return this.userDBRepositoty.save(user);
  }

  getAll() {
    return this.userDBRepositoty.find();
  }

  async getUserById(id: number) {
    const user = await this.userDBRepositoty.findOneBy({ id });
    if (!user) throw new NotFoundException();
    return user;
  }

  updateUserById(id: number, dataUpdate: UpdateUserDto) {
    return this.userDBRepositoty.update({ id }, dataUpdate);
  }

  deleteUserById(id: number) {
    return this.userDBRepositoty.delete({ id });
  }
}
