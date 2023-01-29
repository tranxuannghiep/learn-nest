import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BaseDto } from 'src/common/base.dto';

export class UserDBDto extends BaseDto {
  @Expose()
  id: number;

  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @Transform(({ obj }) => obj.firstname + ' ' + obj.lastname)
  @Expose()
  fullname: string;

  @Expose()
  isActive: boolean;

  @Expose()
  roles: string;
}
