import { BaseEntity } from 'src/common/mysql/base.entity';
import { Entity, Column } from 'typeorm';

@Entity({
  name: 'user',
})
export class UserDBEntity extends BaseEntity {
  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: ['admin', 'customer'],
    default: 'customer',
  })
  roles: string;
}
