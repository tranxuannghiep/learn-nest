import { Controller, Body, Post } from '@nestjs/common';
import { S3UploadDto } from './dto/s3-upload.dto';
import { S3Service } from './s3.service';

@Controller('upload')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  getPresignedPOSTTURL(@Body() s3UploadDto: S3UploadDto) {
    return this.s3Service.getPresignedPOSTTURL(s3UploadDto);
  }
}
