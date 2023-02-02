import { BaseEntity } from 'src/common/mysql/base.entity';
import { UserDBEntity } from 'src/userDB/userDB.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({
  name: 'book',
})
export class BookEntity extends BaseEntity<BookEntity> {
  @ManyToOne(() => UserDBEntity, (user) => user.books, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seller_id' })
  seller: UserDBEntity;

  @Column()
  title: string;

  @Column()
  description: string;

  //   @Column()
  //   categories: string;

  //   @Column()
  //   images: string[];

  @Column()
  original_price: number;

  @Column()
  price: number;

  @Column()
  quantity: number;

  //   @Column()
  //   quantity_sold: number;
}
