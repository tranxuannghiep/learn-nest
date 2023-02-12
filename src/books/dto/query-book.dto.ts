import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class BookQueryDto {
  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @IsInt()
  limit: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @IsInt()
  page: number;

  @ApiProperty({ required: false, type: 'array', items: { type: 'number' } })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @Type(() => Number)
  @IsOptional()
  @IsPositive({ each: true })
  @IsInt({ each: true })
  categories: number[];

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @IsInt()
  seller: number;
}
