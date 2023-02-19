import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from 'src/books/book.entity';
import { StripeModule } from 'src/stripe/stripe.module';
import { UserEntity } from 'src/users/user.entity';
import { OrderDetailEntity } from './order-detail.entity';
import { OrderController } from './order.controller';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookEntity,
      OrderEntity,
      OrderDetailEntity,
      UserEntity,
    ]),
    StripeModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
