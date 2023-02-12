import { Exclude, Expose, Transform } from 'class-transformer';
import { BookEntity } from 'src/books/book.entity';
import { BaseEntity } from 'src/common/mysql/base.entity';
import { Role } from 'src/utils/types';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity extends BaseEntity<UserEntity> {
  @Column({ unique: true })
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
    default: Role.Customer,
  })
  roles: string;

  @OneToMany(() => BookEntity, (book) => book.seller)
  books: BookEntity[];

  @Column({
    nullable: true,
  })
  image?: string;
}
