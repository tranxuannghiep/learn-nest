import { ApiProperty } from '@nestjs/swagger';
import { UpdateUserDto } from '../dto/update-user.dto';

export class UpdateUserSwagger extends UpdateUserDto {
  @ApiProperty({ type: 'file', format: 'binary', required: false })
  image?: Express.Multer.File;
}
