import { IsString } from 'class-validator';

export class S3UploadDto {
  @IsString()
  readonly bucket: string;

  @IsString()
  readonly key: string;

  @IsString()
  readonly contentType: string;
}
