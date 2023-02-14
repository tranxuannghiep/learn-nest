import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from 'src/books/book.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDetailEntity } from './order-detail.entity';
import { OrderEntity } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    @InjectRepository(OrderDetailEntity)
    private readonly orderDetailRepository: Repository<OrderDetailEntity>,
  ) {}

  async createOrder(createOrder: CreateOrderDto) {
    const { items, ...order } = createOrder;
    const newOrder = new OrderEntity(order);
    return await this.orderRepository.save(newOrder).then(async (res) => {
      items.forEach(async (item) => {
        const book = await this.bookRepository.findOneBy({ id: item.id });
        if (book) {
          await this.orderDetailRepository.insert({
            amount: item.amount,
            book: book,
            order: res,
          });
        }
      });
      return res;
    });
  }

  async getAll() {
    return this.orderRepository.find({
      relations: {
        orderDetails: {
          book: {
            seller: true,
            categories: true,
          },
        },
      },
      select: {
        orderDetails: {
          amount: true,
          book: {
            id: true,
            title: true,
            price: true,
            original_price: true,
            images: true,
            seller: {
              id: true,
              firstname: true,
              lastname: true,
            },
            categories: {
              id: true,
              name: true,
            },
          },
        },
      },
    });
  }
}
