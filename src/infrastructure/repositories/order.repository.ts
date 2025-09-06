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

  async findFilledOrdersWithInstrumentsAndMarketData(userId: number): Promise<Order[]> {
    return await this.orderRepo
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.instrument', 'i')
      .leftJoinAndSelect('i.marketData', 'md', 'md.date = (SELECT MAX(md2.date) FROM marketdata md2 WHERE md2.instrumentid = i.id)')
      .where('o.userId = :userId', { userId })
      .andWhere('o.status = :status', { status: OrderStatus.FILLED })
      .orderBy('o.datetime', 'ASC')
      .getMany();
  }

  async save(order: Order): Promise<Order> {
    return await this.orderRepo.save(order);
  }
}
