import { BookEntity } from 'src/books/book.entity';
import { BaseEntity } from 'src/common/mysql/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('order_detail')
export class OrderDetailEntity extends BaseEntity<OrderDetailEntity> {
  @JoinColumn({ name: 'order_id' })
  @ManyToOne(() => OrderEntity, (order) => order.orderDetails)
  order: OrderEntity;

  @JoinColumn({ name: 'book_id' })
  @ManyToOne(() => BookEntity, (book) => book.orderDetails)
  book: BookEntity;

  @Column()
  amount: number;
}
