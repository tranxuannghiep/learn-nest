import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, IsString, Min } from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsPositive()
  readonly original_price: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsPositive()
  readonly price: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  @Min(1)
  readonly quantity: number;

  @ApiProperty({
    type: Number,
    isArray: true,
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @IsNotEmpty()
  @IsPositive({ each: true })
  @IsInt({ each: true })
  readonly categories: number[];
}
