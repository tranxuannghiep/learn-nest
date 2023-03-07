import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { CreateRoomDto } from './create-room.dto';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @IsArray({ each: true })
  @IsPositive({ each: true })
  @IsInt({ each: true })
  @IsOptional()
  users?: number[];

  @IsBoolean()
  @IsOptional()
  deleteUsers?: boolean;
}
