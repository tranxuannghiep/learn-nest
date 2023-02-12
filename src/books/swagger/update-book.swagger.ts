import { ApiProperty } from '@nestjs/swagger';
import { UpdateBookDto } from '../dto/update-book.dto';

export class UpdateBookSwagger extends UpdateBookDto {
  @ApiProperty({ type: 'file', format: 'binary', required: false })
  image?: Express.Multer.File;
}
