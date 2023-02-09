import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, IsString, Min } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsPositive()
  readonly original_price: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsPositive()
  readonly price: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  @Min(1)
  readonly quantity: number;

  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @IsNotEmpty()
  @IsPositive({ each: true })
  @IsInt({ each: true })
  readonly categories: number[];
}
