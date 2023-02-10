import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    minLength: 6,
    maxLength: 28,
    required: false,
  })
  @IsOptional()
  password: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  firstname: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  lastname: string;
}
