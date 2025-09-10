import { Controller, Post, Body, Get, Param, ParseIntPipe, Put } from '@nestjs/common';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case';
import { CreateOrderDto } from '../../application/dtos/create-order.dto';
import { OrderResponseDto } from '../../application/dtos/order-response.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return await this.createOrderUseCase.execute(createOrderDto);
  }
}

