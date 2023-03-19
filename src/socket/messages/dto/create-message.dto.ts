import { IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  text: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  fileName?: string;
}
