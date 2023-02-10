import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';

export class CreateUserSwagger extends CreateUserDto {
  @ApiProperty({ type: 'file', format: 'binary', required: false })
  image?: Express.Multer.File;
}
