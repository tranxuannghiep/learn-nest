import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('order_book')
export class OrderBookEntity {
  @Column()
  @IsNotEmpty()
  @PrimaryColumn()
  order_id: number;

  @Column()
  @IsNotEmpty()
  @PrimaryColumn()
  book_id: number;

  @Column()
  @IsNotEmpty()
  amount: number;
}
