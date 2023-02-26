import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { S3Service } from 'src/aws-s3/s3.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepositoty: Repository<UserEntity>,
    private readonly s3Service: S3Service,
    @InjectQueue('send-mail') private readonly sendMail: Queue,
  ) {}

  async createUser(userDto: CreateUserDto, file?: Express.Multer.File) {
    let fileS3: ManagedUpload.SendData;
    const user = new UserEntity(userDto);

    if (file) {
      fileS3 = await this.s3Service.uploadFile(file);
      user.image = fileS3.Location;
    }

    return await this.userRepositoty
      .save(user)
      .then(async (res) => {
        await this.sendMail.add(
          'register',
          {
            to: userDto.username,
            name: userDto.firstname + ' ' + userDto.lastname,
          },
          {
            removeOnComplete: true,
            removeOnFail: true,
          },
        );
        return res;
      })
      .catch(async (error) => {
        if (fileS3 && fileS3.Key) {
          await this.s3Service.deleteFile(fileS3.Key);
        }
        throw error;
      });
  }

  getAll(paginationQuery: PaginationQueryDto) {
    const { limit = 10, page = 1 } = paginationQuery;
    return (
      this.userRepositoty
        // .createQueryBuilder()
        // .skip((page - 1) * limit)
        // .take(limit)
        // .select(['id AS uid', 'firstname', 'lastname', 'isActive'])
        // .getRawMany();

        .find({
          skip: (page - 1) * limit,
          take: limit,
          select: ['id', 'firstname', 'lastname', 'isActive'],
        })
    );
  }

  async getUserById(id: number) {
    const user = await this.userRepositoty.find({
      where: { id },
      relations: {
        books: true,
      },
      select: {
        books: {
          id: true,
          title: true,
        },
      },
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  async updateUserById(
    id: number,
    dataUpdate: UpdateUserDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.userRepositoty.findOneBy({ id });
    const oldImage = user.image;

    let fileS3: ManagedUpload.SendData;
    if (file) {
      fileS3 = await this.s3Service.uploadFile(file);
      user.image = fileS3.Location;
    }
    return this.userRepositoty
      .save({ ...user, ...dataUpdate })
      .then(async (res) => {
        if (oldImage) {
          await this.s3Service.deleteFile(new URL(oldImage).pathname.slice(1));
        }
        return res;
      })
      .catch(async (error) => {
        if (fileS3 && fileS3.Key) {
          await this.s3Service.deleteFile(fileS3.Key);
        }
        throw error;
      });
  }

  deleteUserById(id: number) {
    return this.userRepositoty.delete({ id });
  }

  findOne(username: string) {
    return this.userRepositoty.findOneBy({ username });
  }
}
