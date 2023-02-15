import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrder: CreateOrderDto) {
    return this.orderService.createOrder(createOrder);
  }

  @Get('/all')
  async getAll() {
    return this.orderService.getAll();
  }

  @Get(':id')
  async getOrderById(@Param('id') id: number) {
    return this.orderService.getOrderById(id);
  }

  @Get('store/:id')
  async getOrderByStore(@Param('id') id: number) {
    return this.orderService.getOrderByStore(id);
  }
}
