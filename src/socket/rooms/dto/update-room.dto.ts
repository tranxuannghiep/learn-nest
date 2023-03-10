import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';
import { CreateRoomDto } from './create-room.dto';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @IsPositive({ each: true })
  @IsInt({ each: true })
  @IsOptional()
  users?: number[];

  @IsBoolean()
  @IsOptional()
  deleteUsers?: boolean;
}
