import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { OrderResponseDto } from '../dtos/order-response.dto';
import { OrderStatus } from '../../domain/value-objects/order-status.enum';

@Injectable()
export class CancelOrderUseCase {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(orderId: number, userId: number): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findById(orderId);
    
    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    if (order.userId !== userId) {
      throw new BadRequestException('You do not have permission to cancel this order');
    }

    if (order.status !== OrderStatus.NEW) {
      throw new BadRequestException(
        `Only orders with NEW status can be cancelled. Current status: ${order.status}`
      );
    }

    order.status = OrderStatus.CANCELLED;
    const updatedOrder = await this.orderRepository.save(order);

    return new OrderResponseDto(
      updatedOrder.id,
      updatedOrder.userId,
      updatedOrder.instrumentId,
      updatedOrder.side,
      updatedOrder.type,
      updatedOrder.status,
      updatedOrder.size,
      updatedOrder.price,
      0, // executedPrice is 0 for cancelled orders
      updatedOrder.datetime
    );
  }
}
