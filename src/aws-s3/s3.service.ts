import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { S3UploadDto } from './dto/s3-upload.dto';
@Injectable()
export class S3Service {
  private readonly region;
  private readonly accessKeyId;
  private readonly secretAccessKey;
  private readonly publicBucketName;
  private s3: S3;
  constructor(private configService: ConfigService) {
    this.region = configService.get('aws.region');
    this.accessKeyId = configService.get('aws.accessKeyId');
    this.secretAccessKey = configService.get('aws.secretAccessKey');
    this.publicBucketName = configService.get('aws.bucketName');
    this.s3 = new S3({
      region: this.region,
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const key =
      file.fieldname +
      '-' +
      uuidv4().slice(0, 10) +
      path.extname(file.originalname);
    const params = {
      Bucket: this.publicBucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };
    try {
      const res = await this.s3.upload(params).promise();
      return res;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async updateFile(key: string, file: Express.Multer.File) {
    try {
      const res = await this.s3
        .putObject({
          Bucket: this.publicBucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
          CacheControl: 'no-cache',
        })
        .promise();
      return res;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async deleteFile(key: string) {
    try {
      const res = await this.s3
        .deleteObject({
          Bucket: this.publicBucketName,
          Key: key,
        })
        .promise();
      return res;
    } catch (error) {
      return error;
    }
  }

  async getFiles() {
    try {
      const res = await this.s3
        .listObjects({
          Bucket: this.publicBucketName,
        })
        .promise();
      return res;
    } catch (error) {
      return error;
    }
  }

  getPresignedPOSTTURL = (s3UploadDto: S3UploadDto) => {
    const { bucket, key, contentType } = s3UploadDto;
    return this.s3.createPresignedPost({
      Bucket: bucket,
      Expires: 100,
      Fields: {
        key,
        acl: 'public-read',
        'Content-Type': contentType,
      },
      Conditions: [['content-length-range', 0, 100000]],
    });
  };
}
