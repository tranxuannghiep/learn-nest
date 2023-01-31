import { Controller, Post, Get, UseGuards, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const access_token = await this.authService.login(req.user);
    res.cookie('access_token', access_token, { httpOnly: true });
    return {
      access_token,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
