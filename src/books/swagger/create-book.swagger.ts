import { ApiProperty } from '@nestjs/swagger';
import { CreateBookDto } from '../dto/create-book.dto';

export class CreateBookSwagger extends CreateBookDto {
  @ApiProperty({ type: 'file', format: 'binary', required: false })
  image?: Express.Multer.File;
}
