import { OrderSide } from '../../domain/value-objects/order-side.enum';
import { OrderType } from '../../domain/value-objects/order-type.enum';
import { OrderStatus } from '../../domain/value-objects/order-status.enum';

export class OrderResponseDto {
  id: number;
  userId: number;
  instrumentId: number;
  side: OrderSide;
  type: OrderType;
  status: OrderStatus;
  quantity: number;
  price: number;
  executedPrice: number;
  datetime: Date;

  constructor(
    id: number,
    userId: number,
    instrumentId: number,
    side: OrderSide,
    type: OrderType,
    status: OrderStatus,
    quantity: number,
    price: number,
    executedPrice: number,
    datetime: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.instrumentId = instrumentId;
    this.side = side;
    this.type = type;
    this.status = status;
    this.quantity = quantity;
    this.price = price;
    this.executedPrice = executedPrice;
    this.datetime = datetime;
  }
}

