import { Injectable } from '@nestjs/common';
import { UserDBService } from 'src/userDB/userDB.service';
import { comparePassword } from 'src/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDBEntity } from 'src/userDB/userDB.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserDBService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const existedUser = await this.usersService.findOne(username);
    if (!existedUser) return null;

    const isMatch = await comparePassword(password, existedUser.password);
    if (!isMatch) return null;

    delete existedUser.password;
    return existedUser;
  }
  async login(user: UserDBEntity) {
    const payload = { ...user };
    delete payload.password;
    return this.jwtService.sign(payload);
  }
}
