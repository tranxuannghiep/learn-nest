import { Module } from '@nestjs/common';
import { UserDBModule } from 'src/userDB/userDB.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './guards/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/jwt.strategy';
import { AuthController } from './auth.controller';
import { jwtConfig } from 'src/config/jwt.config';

@Module({
  imports: [UserDBModule, PassportModule, JwtModule.registerAsync(jwtConfig)],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
