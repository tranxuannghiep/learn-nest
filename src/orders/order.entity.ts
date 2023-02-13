import { BookEntity } from 'src/books/book.entity';
import { BaseEntity } from 'src/common/mysql/base.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity({ name: 'order' })
export class OrderEntity extends BaseEntity<OrderEntity> {
  @ManyToMany(() => BookEntity, (book) => book.orders)
  @JoinTable({
    name: 'order_book',
    joinColumn: {
      name: 'order_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'book_id',
      referencedColumnName: 'id',
    },
  })
  books: BookEntity[];

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: number;
}
