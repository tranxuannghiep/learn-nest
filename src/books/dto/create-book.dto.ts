import { IsNotEmpty } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly original_price: number;

  @IsNotEmpty()
  readonly price: number;

  @IsNotEmpty()
  readonly quantity: number;
}
