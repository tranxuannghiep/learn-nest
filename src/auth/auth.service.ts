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

    return existedUser;
  }
  async login(user: UserDBEntity) {
    const payload = { id: user.id, username: user.username, role: user.roles };
    return this.jwtService.sign(payload);
  }

  async getProfile(username: string) {
    return this.usersService.findOne(username);
  }
}
