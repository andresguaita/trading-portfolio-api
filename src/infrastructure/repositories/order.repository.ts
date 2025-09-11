import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../domain/entities/order.entity';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { OrderStatus } from '../../domain/value-objects/order-status.enum';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async findById(id: number): Promise<Order | null> {
    return await this.orderRepo.findOne({
      where: { id },
      relations: ['instrument']
    });
  }

  async findByUserIdAndStatus(userId: number, status: OrderStatus): Promise<Order[]> {
    return await this.orderRepo.find({
      where: { userId, status },
      relations: ['instrument'],
      order: { datetime: 'DESC' }
    });
  }

  async findFilledOrdersByUserId(userId: number): Promise<Order[]> {
    return await this.orderRepo.find({
      where: { userId, status: OrderStatus.FILLED },
      relations: ['instrument'],
      order: { datetime: 'ASC' }
    });
  }

  async findFilledOrdersWithInstruments(userId: number): Promise<Order[]> {
    return await this.orderRepo.find({
      where: { userId, status: OrderStatus.FILLED },
      relations: ['instrument'],
      order: { datetime: 'ASC' }
    });
  }

  async save(order: Order): Promise<Order> {
    return await this.orderRepo.save(order);
  }
}
