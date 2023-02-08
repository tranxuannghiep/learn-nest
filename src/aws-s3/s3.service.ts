import { BadRequestException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class S3Service {
  private readonly region;
  private readonly accessKeyId;
  private readonly secretAccessKey;
  private readonly publicBucketName;
  private s3: S3;
  constructor() {
    this.region = process.env.AWS_REGION;
    this.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    this.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    this.publicBucketName = process.env.AWS_PUBLIC_BUCKET_NAME;
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
}
