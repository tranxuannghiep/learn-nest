import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from 'src/aws-s3/s3.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { encodePassword } from 'src/utils/bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDBEntity } from './userDB.entity';

@Injectable()
export class UserDBService {
  constructor(
    @InjectRepository(UserDBEntity)
    private readonly userDBRepositoty: Repository<UserDBEntity>,
    private readonly s3Service: S3Service,
  ) {}

  async createUser(userDBDto: CreateUserDto, file?: Express.Multer.File) {
    try {
      const password = await encodePassword(userDBDto.password);
      const user = await this.userDBRepositoty.create({
        ...userDBDto,
        password,
      });
      if (file) {
        const urlImage = await this.s3Service.uploadFile(file);
        user.image = urlImage;
      }
      return await this.userDBRepositoty.save(user);
    } catch (error) {
      if (error.errno === 1062)
        throw new ConflictException('Username already exists');
      else throw new InternalServerErrorException();
    }
  }

  getAll(paginationQuery: PaginationQueryDto) {
    const { limit = 10, page = 1 } = paginationQuery;
    return (
      this.userDBRepositoty
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
    const user = await this.userDBRepositoty.find({
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

  updateUserById(id: number, dataUpdate: UpdateUserDto) {
    return this.userDBRepositoty.update({ id }, dataUpdate);
  }

  deleteUserById(id: number) {
    return this.userDBRepositoty.delete({ id });
  }

  findOne(username: string) {
    return this.userDBRepositoty.findOneBy({ username });
  }
}
