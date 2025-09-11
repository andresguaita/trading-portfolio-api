import { Order } from '../entities/order.entity';
import { OrderStatus } from '../value-objects/order-status.enum';

export interface IOrderRepository {
  findById(id: number): Promise<Order | null>;
  findByUserIdAndStatus(userId: number, status: OrderStatus): Promise<Order[]>;
  findFilledOrdersByUserId(userId: number): Promise<Order[]>;
  findFilledOrdersWithInstruments(userId: number): Promise<Order[]>;
  save(order: Order): Promise<Order>;
}
