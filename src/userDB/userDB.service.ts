import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { encodePassword } from 'src/utils/bcrypt';
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
    const password = await encodePassword(userDBDto.password);
    const user = await this.userDBRepositoty.create({ ...userDBDto, password });
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

  findOne(username: string) {
    return this.userDBRepositoty.findOneBy({ username });
  }
}
