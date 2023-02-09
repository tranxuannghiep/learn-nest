import { CategoryEntity } from 'src/categories/category.entity';
import { BaseEntity } from 'src/common/mysql/base.entity';
import { UserDBEntity } from 'src/userDB/userDB.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity({
  name: 'book',
})
export class BookEntity extends BaseEntity<BookEntity> {
  @ManyToOne(() => UserDBEntity, (user) => user.books, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seller_id' })
  seller: UserDBEntity;

  @Column({
    unique: true,
  })
  title: string;

  @Column()
  description: string;

  @ManyToMany(() => CategoryEntity, (category) => category.books)
  @JoinTable({
    joinColumn: {
      name: 'book_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  categories: CategoryEntity[];

  @Column('json', { nullable: true })
  images?: string[];

  @Column()
  original_price: number;

  @Column()
  price: number;

  @Column()
  quantity: number;

  //   @Column()
  //   quantity_sold: number;
}
