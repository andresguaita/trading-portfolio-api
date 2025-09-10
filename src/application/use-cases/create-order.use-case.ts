import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { IInstrumentRepository } from '../../domain/repositories/instrument.repository.interface';
import { IMarketDataRepository } from '../../domain/repositories/market-data.repository.interface';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderResponseDto } from '../dtos/order-response.dto';
import { Order } from '../../domain/entities/order.entity';
import { OrderSide } from '../../domain/value-objects/order-side.enum';
import { OrderType } from '../../domain/value-objects/order-type.enum';
import { OrderStatus } from '../../domain/value-objects/order-status.enum';
import { OrderValidationService } from '../services/order-validation.service';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('IInstrumentRepository')
    private readonly instrumentRepository: IInstrumentRepository,
    @Inject('IMarketDataRepository')
    private readonly marketDataRepository: IMarketDataRepository,
    private readonly orderValidationService: OrderValidationService,
  ) {}

  async execute(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    const { userId, instrumentId } = createOrderDto;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const validationResult = await this.orderValidationService.validateOrder(createOrderDto);
    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors[0]);
    }

    const instrument = await this.instrumentRepository.findById(instrumentId);
    if (!instrument) {
      throw new NotFoundException(`Instrument with id ${instrumentId} not found`);
    }

    const { orderPrice, finalQuantity } = await this.calculateOrderDetails(createOrderDto);
    const orderStatus = await this.determineOrderStatus(createOrderDto, orderPrice, finalQuantity);

    const order = this.buildOrder(createOrderDto, orderPrice, finalQuantity, orderStatus);
    const savedOrder = await this.orderRepository.save(order);
    savedOrder.instrument = instrument;

    return new OrderResponseDto(
      savedOrder.id,
      savedOrder.userId,
      savedOrder.instrumentId,
      savedOrder.side,
      savedOrder.type,
      savedOrder.status,
      savedOrder.size,
      savedOrder.price,
      orderStatus === OrderStatus.FILLED ? orderPrice : 0,
      savedOrder.datetime
    );
  }

  private async calculateOrderDetails(createOrderDto: CreateOrderDto): Promise<{ orderPrice: number; finalQuantity: number }> {
    const { type, price, quantity, amount, instrumentId, side } = createOrderDto;

    let orderPrice = 0;
    let finalQuantity = 0;

    if (side === OrderSide.CASH_IN || side === OrderSide.CASH_OUT) {
      orderPrice = 1;
      finalQuantity = quantity || amount || 0;
    } else if (type === OrderType.LIMIT) {
      orderPrice = price || 0;
      finalQuantity = quantity || Math.floor((amount || 0) / orderPrice);
    } else {
      const marketData = await this.marketDataRepository.findLatestByInstrumentId(instrumentId);
      if (!marketData) {
        throw new NotFoundException(`Market data not found for instrument ${instrumentId}`);
      }
      orderPrice = parseFloat(marketData.close.toString());
      finalQuantity = quantity || Math.floor((amount || 0) / orderPrice);
    }

    if (finalQuantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    return { orderPrice, finalQuantity };
  }

  private async determineOrderStatus(
    createOrderDto: CreateOrderDto,
    orderPrice: number,
    finalQuantity: number
  ): Promise<OrderStatus> {
    const { type } = createOrderDto;

    if (type === OrderType.LIMIT) {
      return OrderStatus.NEW;
    }

    return OrderStatus.FILLED;
  }

  private buildOrder(
    createOrderDto: CreateOrderDto,
    orderPrice: number,
    finalQuantity: number,
    orderStatus: OrderStatus
  ): Order {
    const order = new Order();
    order.userId = createOrderDto.userId;
    order.instrumentId = createOrderDto.instrumentId;
    order.side = createOrderDto.side;
    order.type = createOrderDto.type;
    order.status = orderStatus;
    order.size = finalQuantity;
    order.price = orderPrice;
    order.datetime = new Date();

    return order;
  }
}