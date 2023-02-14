import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

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

  @IsNotEmpty()
  items: Item[];
}

interface Item {
  id: number;
  amount: number;
}
