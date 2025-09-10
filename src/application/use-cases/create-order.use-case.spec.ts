import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateOrderUseCase } from './create-order.use-case';
import { OrderValidationService } from '../services/order-validation.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderSide } from '../../domain/value-objects/order-side.enum';
import { OrderType } from '../../domain/value-objects/order-type.enum';
import { OrderStatus } from '../../domain/value-objects/order-status.enum';

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
  let mockUserRepository: any;
  let mockOrderRepository: any;
  let mockInstrumentRepository: any;
  let mockMarketDataRepository: any;
  let mockOrderValidationService: any;

  beforeEach(async () => {
    mockUserRepository = { findById: jest.fn() };
    mockOrderRepository = { save: jest.fn() };
    mockInstrumentRepository = { findById: jest.fn() };
    mockMarketDataRepository = { findLatestByInstrumentId: jest.fn() };
    mockOrderValidationService = { validateOrder: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderUseCase,
        { provide: 'IUserRepository', useValue: mockUserRepository },
        { provide: 'IOrderRepository', useValue: mockOrderRepository },
        { provide: 'IInstrumentRepository', useValue: mockInstrumentRepository },
        { provide: 'IMarketDataRepository', useValue: mockMarketDataRepository },
        { provide: OrderValidationService, useValue: mockOrderValidationService },
      ],
    }).compile();

    useCase = module.get<CreateOrderUseCase>(CreateOrderUseCase);
  });

  it('should create a MARKET BUY order successfully', async () => {
    const orderDto: CreateOrderDto = {
      userId: 1,
      instrumentId: 47,
      side: OrderSide.BUY,
      type: OrderType.MARKET,
      quantity: 10,
    };

    mockUserRepository.findById.mockResolvedValue({ id: 1, email: 'test@test.com' });
    mockOrderValidationService.validateOrder.mockResolvedValue({ isValid: true, errors: [] });
    mockInstrumentRepository.findById.mockResolvedValue({ id: 47, ticker: 'PAMP' });
    mockMarketDataRepository.findLatestByInstrumentId.mockResolvedValue({ close: 925.50 });
    mockOrderRepository.save.mockResolvedValue({
      id: 1,
      userId: 1,
      instrumentId: 47,
      side: OrderSide.BUY,
      size: 10,
      price: 925.50,
      type: OrderType.MARKET,
      status: OrderStatus.FILLED,
      datetime: new Date(),
    });

    const result = await useCase.execute(orderDto);

    expect(result.status).toBe(OrderStatus.FILLED);
    expect(result.quantity).toBe(10);
    expect(mockOrderRepository.save).toHaveBeenCalled();
  });

  it('should create a LIMIT order with NEW status', async () => {
    const orderDto: CreateOrderDto = {
      userId: 1,
      instrumentId: 47,
      side: OrderSide.SELL,
      type: OrderType.LIMIT,
      quantity: 5,
      price: 950.00,
    };

    mockUserRepository.findById.mockResolvedValue({ id: 1 });
    mockOrderValidationService.validateOrder.mockResolvedValue({ isValid: true, errors: [] });
    mockInstrumentRepository.findById.mockResolvedValue({ id: 47 });
    mockOrderRepository.save.mockResolvedValue({
      id: 2,
      side: OrderSide.SELL,
      size: 5,
      price: 950.00,
      type: OrderType.LIMIT,
      status: OrderStatus.NEW,
    });

    const result = await useCase.execute(orderDto);

    expect(result.status).toBe(OrderStatus.NEW);
  });

  it('should reject order when user not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    const orderDto: CreateOrderDto = {
      userId: 999,
      instrumentId: 47,
      side: OrderSide.BUY,
      type: OrderType.MARKET,
      quantity: 10,
    };

    await expect(useCase.execute(orderDto)).rejects.toThrow(NotFoundException);
  });

  it('should reject order when validation fails', async () => {
    mockUserRepository.findById.mockResolvedValue({ id: 1 });
    mockOrderValidationService.validateOrder.mockResolvedValue({
      isValid: false,
      errors: ['Insufficient funds']
    });

    const orderDto: CreateOrderDto = {
      userId: 1,
      instrumentId: 47,
      side: OrderSide.BUY,
      type: OrderType.MARKET,
      quantity: 1000,
    };

    await expect(useCase.execute(orderDto)).rejects.toThrow(BadRequestException);
  });
});
