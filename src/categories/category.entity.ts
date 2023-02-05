import { BookEntity } from 'src/books/book.entity';
import { BaseEntity } from 'src/common/mysql/base.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity('category')
export class CategoryEntity extends BaseEntity<CategoryEntity> {
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => BookEntity, (book) => book.categories)
  books: BookEntity[];
}
