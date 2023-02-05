import { IsInt, IsNotEmpty, IsPositive, IsString, Min } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsPositive()
  readonly original_price: number;

  @IsNotEmpty()
  @IsPositive()
  readonly price: number;

  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  @Min(1)
  readonly quantity: number;

  @IsNotEmpty()
  @IsPositive({ each: true })
  @IsInt({ each: true })
  readonly categories: number[];
}
