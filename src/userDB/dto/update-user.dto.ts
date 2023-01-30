import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  password: string;

  @IsOptional()
  firstname: string;

  @IsOptional()
  lastname: string;
}
