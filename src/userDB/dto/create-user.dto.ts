import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly username: string;

  @IsNotEmpty()
  @Length(6, 28)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly firstname: string;

  @IsNotEmpty()
  @IsString()
  readonly lastname: string;
}
