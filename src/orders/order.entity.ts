import { BaseEntity } from 'src/common/mysql/base.entity';
import { UserEntity } from 'src/users/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrderDetailEntity } from './order-detail.entity';

@Entity({ name: 'order' })
export class OrderEntity extends BaseEntity<OrderEntity> {
  @OneToMany(() => OrderDetailEntity, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetailEntity[];

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: number;

  @ManyToOne(() => UserEntity, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
