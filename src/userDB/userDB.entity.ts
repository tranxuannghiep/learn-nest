import { Exclude, Expose, Transform } from 'class-transformer';
import { BaseEntity } from 'src/common/mysql/base.entity';
import { Role } from 'src/utils/types';
import { Entity, Column } from 'typeorm';

@Entity({
  name: 'user',
})
export class UserDBEntity extends BaseEntity<UserDBEntity> {
  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column()
  firstname: string;

  @Exclude()
  @Column()
  lastname: string;

  @Transform(({ obj }) => obj.firstname + ' ' + obj.lastname)
  @Expose()
  fullname: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: 'customer',
  })
  roles: string;
}
