import { Controller, Post, Body, Get, Param, ParseIntPipe, Put, Query } from '@nestjs/common';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case';
import { CancelOrderUseCase } from '../../application/use-cases/cancel-order.use-case';
import { CreateOrderDto } from '../../application/dtos/create-order.dto';
import { OrderResponseDto } from '../../application/dtos/order-response.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
  ) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return await this.createOrderUseCase.execute(createOrderDto);
  }

  @Put(':orderId/cancel')
  async cancelOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<OrderResponseDto> {
    return await this.cancelOrderUseCase.execute(orderId, userId);
  }
}

