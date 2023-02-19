import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@Req() req: Request, @Body() createOrder: CreateOrderDto) {
    const { id } = req.user;
    return this.orderService.createOrder(id, createOrder);
  }

  @Get('/all')
  async getAll() {
    return this.orderService.getAll();
  }

  @Get('/customer')
  @UseGuards(JwtAuthGuard)
  async getOrder(@Req() req: Request) {
    const { id } = req.user;
    return this.orderService.getOrderByCustomer(id);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: number) {
    return this.orderService.getOrderById(id);
  }

  @Get('store/:id')
  async getOrderByStore(@Param('id') id: number) {
    return this.orderService.getOrderByStore(id);
  }

  @Post('/payment')
  async payment() {
    return this.orderService.createCheckoutSession();
  }
}
