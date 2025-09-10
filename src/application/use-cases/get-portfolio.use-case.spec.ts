import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetPortfolioUseCase } from './get-portfolio.use-case';

describe('GetPortfolioUseCase', () => {
  let useCase: GetPortfolioUseCase;
  let mockUserRepository: any;
  let mockOrderRepository: any;
  let mockMarketDataRepository: any;

  beforeEach(async () => {
    mockUserRepository = { findById: jest.fn() };
    mockOrderRepository = { findFilledOrdersWithInstruments: jest.fn() };
    mockMarketDataRepository = { findLatestForInstruments: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPortfolioUseCase,
        { provide: 'IUserRepository', useValue: mockUserRepository },
        { provide: 'IOrderRepository', useValue: mockOrderRepository },
        { provide: 'IMarketDataRepository', useValue: mockMarketDataRepository },
      ],
    }).compile();

    useCase = module.get<GetPortfolioUseCase>(GetPortfolioUseCase);
  });

  it('should return portfolio with cash and positions', async () => {
    const userId = 1;
    
    mockUserRepository.findById.mockResolvedValue({ id: 1, email: 'test@test.com' });
    mockOrderRepository.findFilledOrdersWithInstruments.mockResolvedValue([
      {
        side: 'CASH_IN',
        size: 100000,
        price: 1,
        instrument: { type: 'MONEDA' }
      },
      {
        side: 'BUY',
        size: 100,
        price: 900,
        instrumentId: 47,
        instrument: { id: 47, ticker: 'PAMP', type: 'EQUITY' }
      }
    ]);
    mockMarketDataRepository.findLatestForInstruments.mockResolvedValue([
      { instrumentId: 47, close: 950, previousClose: 900 }
    ]);

    const result = await useCase.execute(userId);

    expect(result.userId).toBe(1);
    expect(result.availableCash).toBe(10000); // 100000 - (100 * 900)
    expect(result.positions).toHaveLength(1);
    expect(result.positions[0].ticker).toBe('PAMP');
  });

  it('should throw error when user not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(999)).rejects.toThrow(NotFoundException);
  });
});