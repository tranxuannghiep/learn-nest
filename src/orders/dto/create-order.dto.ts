import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNumberString()
  @IsNotEmpty()
  phone: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsPositive({ each: true })
  @IsInt({ each: true })
  books: number[];

  @Type(() => Number)
  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  amount: number;
}
