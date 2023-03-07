import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  createRoom(@Req() req: Request, @Body() createRoomDto: CreateRoomDto) {
    const { id } = req.user;
    return this.roomService.createRoom(id, createRoomDto);
  }
}
