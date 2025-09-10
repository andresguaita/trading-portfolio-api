import { IsNotEmpty, IsInt, IsPositive, IsEnum, IsOptional, IsNumber, Min } from 'class-validator';
import { OrderSide } from '../../domain/value-objects/order-side.enum';
import { OrderType } from '../../domain/value-objects/order-type.enum';

export class CreateOrderDto {
  @IsInt()
  @IsPositive()
  userId: number;

  @IsInt()
  @IsPositive()
  instrumentId: number;

  @IsEnum(OrderSide)
  @IsNotEmpty()
  side: OrderSide;

  @IsEnum(OrderType)
  @IsNotEmpty()
  type: OrderType;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  price?: number;
}
