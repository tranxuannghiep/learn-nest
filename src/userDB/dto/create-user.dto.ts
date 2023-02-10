import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly username: string;

  @ApiProperty({
    minLength: 6,
    maxLength: 28,
  })
  @IsNotEmpty()
  @Length(6, 28)
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly firstname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly lastname: string;
}
