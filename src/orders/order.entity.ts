import { BaseEntity } from 'src/common/mysql/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
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
}
