import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from 'src/books/book.entity';
import { UserEntity } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDetailEntity } from './order-detail.entity';
import { OrderEntity } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderDetailEntity)
    private readonly orderDetailRepository: Repository<OrderDetailEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createOrder(id: number, createOrder: CreateOrderDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException();
    const { items, ...order } = createOrder;
    const newOrder = new OrderEntity(order);
    newOrder.user = user;
    return await this.orderRepository.manager.transaction(async (manager) => {
      const queryRunner = manager.queryRunner;
      await queryRunner.startTransaction();
      try {
        const orderManager = await manager.save(newOrder);
        for (const item of items) {
          const bookUpdate = await manager.findOne(BookEntity, {
            where: { id: item.id },
            lock: { mode: 'pessimistic_write' },
          });

          if (!bookUpdate) {
            throw new NotFoundException(`Product with id ${item.id} not found`);
          }

          if (bookUpdate.quantity < item.amount) {
            throw new BadRequestException(
              `Insufficient quantity for product with id ${item.id}`,
            );
          }

          bookUpdate.quantity -= item.amount;
          bookUpdate.quantity_sold += item.amount;
          await manager.save(bookUpdate);

          await manager.insert(OrderDetailEntity, {
            amount: item.amount,
            book: bookUpdate,
            order: orderManager,
          });
        }

        await queryRunner.commitTransaction();
        return orderManager;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      }
    });
  }

  async getAll() {
    return this.orderRepository.find({
      relations: {
        orderDetails: {
          book: true,
        },
        user: true,
      },
      select: {
        orderDetails: {
          amount: true,
          id: true,
          book: {
            id: true,
            original_price: true,
            images: true,
          },
        },
        user: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
    });
  }

  async getOrderById(id: number) {
    return await this.orderRepository.findOne({
      where: { id: id },
      relations: {
        orderDetails: {
          book: {
            seller: true,
            categories: true,
          },
        },
        user: true,
      },
      select: {
        orderDetails: {
          amount: true,
          id: true,
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
        user: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
    });
  }

  async getOrderByStore(id: number) {
    return this.orderDetailRepository.find({
      where: {
        book: {
          seller: {
            id,
          },
        },
      },
      relations: {
        book: true,
      },
      select: {
        book: {
          id: true,
          price: true,
          images: true,
          original_price: true,
        },
      },
    });
  }
}
