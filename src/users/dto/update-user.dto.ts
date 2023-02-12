import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    minLength: 6,
    maxLength: 28,
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @Length(6, 28)
  password: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastname: string;
}
