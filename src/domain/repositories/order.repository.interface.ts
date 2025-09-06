import { Order } from '../entities/order.entity';
import { OrderStatus } from '../value-objects/order-status.enum';

export interface IOrderRepository {
  findByUserIdAndStatus(userId: number, status: OrderStatus): Promise<Order[]>;
  findFilledOrdersByUserId(userId: number): Promise<Order[]>;
  findFilledOrdersWithInstrumentsAndMarketData(userId: number): Promise<Order[]>;
  save(order: Order): Promise<Order>;
}
