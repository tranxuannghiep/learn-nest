import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class BookQueryDto {
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @IsInt()
  limit: number;

  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @IsInt()
  page: number;

  @Type(() => Number)
  @IsOptional()
  @IsPositive({ each: true })
  @IsInt({ each: true })
  categories: number[];

  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @IsInt()
  seller: number;
}
