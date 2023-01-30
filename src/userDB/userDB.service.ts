import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { comparePassword, encodePassword } from 'src/utils/bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUser } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDBEntity } from './userDB.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

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

  async login(loginPayload: LoginUser) {
    const { username, password } = loginPayload;

    const existedUser = await this.userDBRepositoty.findOneBy({ username });
    if (!existedUser)
      throw new HttpException('username or password is incorrect', 400);

    const isMatch = await comparePassword(password, existedUser.password);
    if (!isMatch)
      throw new HttpException('username or password is incorrect', 400);
    const token = jwt.sign(
      {
        username: existedUser.username,
        fullname: existedUser.fullname,
        role: existedUser.roles,
        id: existedUser.id,
      },
      // process.env.JWT_SECRET,
      '123456',
      { expiresIn: '1h' },
    );
    return token;
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
