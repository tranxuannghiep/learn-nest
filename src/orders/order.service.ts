import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from 'src/books/book.entity';
import { In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderBookEntity } from './order-book.entity';
import { OrderEntity } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    @InjectRepository(OrderBookEntity)
    private readonly orderBookRepository: Repository<OrderBookEntity>,
  ) {}
  async createOrder(createOrder: CreateOrderDto) {
    const { books, amount, ...order } = createOrder;
    const newOrder = new OrderEntity(order);
    const listBookEntity = await this.bookRepository.findBy({ id: In(books) });
    newOrder.books = listBookEntity;
    console.log(createOrder);
  }
}
