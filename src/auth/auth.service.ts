import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { comparePassword } from 'src/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const existedUser = await this.usersService.findOne(username);
    if (!existedUser) return null;

    const isMatch = await comparePassword(password, existedUser.password);
    if (!isMatch) return null;

    return existedUser;
  }
  async login(user: UserEntity) {
    const payload = { id: user.id, username: user.username, role: user.roles };
    return this.jwtService.sign(payload);
  }

  async getProfile(username: string) {
    return this.usersService.findOne(username);
  }
}
