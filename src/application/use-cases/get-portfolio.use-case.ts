import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { IMarketDataRepository } from '../../domain/repositories/market-data.repository.interface';
import { PortfolioResponseDto } from '../dtos/portfolio-response.dto';
import { PortfolioPositionDto } from '../dtos/portfolio-position.dto';
import { Order } from '../../domain/entities/order.entity';
import { Position } from '../types/position.type';

@Injectable()
export class GetPortfolioUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('IMarketDataRepository')
    private readonly marketDataRepository: IMarketDataRepository,
  ) {}

  async execute(userId: number): Promise<PortfolioResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const ordersWithInstruments = await this.orderRepository.findFilledOrdersWithInstruments(userId);
    
    const cashBalance = this.calculateCashBalance(ordersWithInstruments);
    const positions = this.calculatePositions(ordersWithInstruments);
    
    if (positions.length === 0) {
      return new PortfolioResponseDto(userId, cashBalance, cashBalance, []);
    }

    const instrumentIds = positions.map(p => p.instrumentId);
    const marketDataList = await this.marketDataRepository.findLatestForInstruments(instrumentIds);
    const marketDataMap = new Map(marketDataList.map(md => [md.instrumentId, md]));

    const portfolioPositions: PortfolioPositionDto[] = [];
    let totalPortfolioValue = cashBalance;

    for (const position of positions) {
      const marketData = marketDataMap.get(position.instrumentId);
      const currentPrice = parseFloat(marketData?.close?.toString() || '0');
      const previousClose = parseFloat(marketData?.previousClose?.toString() || '0');
      
      const totalValue = position.quantity * currentPrice;
      const totalReturn = position.totalCost > 0 ? ((totalValue - position.totalCost) / position.totalCost) * 100 : 0;
      const dailyReturn = previousClose > 0 ? ((currentPrice - previousClose) / previousClose) * 100 : 0;

      totalPortfolioValue += totalValue;

      portfolioPositions.push(new PortfolioPositionDto(
        position.instrumentId,
        position.ticker,
        position.name,
        position.quantity,
        currentPrice,
        position.avgCost,
        totalValue,
        totalReturn,
        dailyReturn
      ));
    }

    return new PortfolioResponseDto(
      userId,
      totalPortfolioValue,
      cashBalance,
      portfolioPositions
    );
  }

  private calculateCashBalance(orders: Order[]): number {
    let cashBalance = 0;
    
    for (const order of orders) {
      const size = parseFloat(order.size?.toString() || '0');
      const price = parseFloat(order.price?.toString() || '0');
      
      switch (order.side) {
        case 'CASH_IN':
          cashBalance += size;
          break;
        case 'CASH_OUT':
          cashBalance -= size;
          break;
        case 'BUY':
          if (order.instrument.type !== 'MONEDA') {
            cashBalance -= (size * price);
          }
          break;
        case 'SELL':
          if (order.instrument.type !== 'MONEDA') {
            cashBalance += (size * price);
          }
          break;
      }
    }
    
    return cashBalance;
  }

  private calculatePositions(orders: Order[]): Position[] {
    const positionMap = new Map<number, Position>();
    
    const sortedOrders = [...orders].sort((a, b) => 
      new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );
    
    for (const order of sortedOrders) {
      if (order.side === 'CASH_IN' || order.side === 'CASH_OUT') continue;
      if (order.instrument.type === 'MONEDA') continue;
      
      const size = parseFloat(order.size?.toString() || '0');
      const price = parseFloat(order.price?.toString() || '0');
      const instrumentId = order.instrumentId;
      
      if (!positionMap.has(instrumentId)) {
        positionMap.set(instrumentId, {
          instrumentId,
          ticker: order.instrument.ticker,
          name: order.instrument.name,
          quantity: 0,
          totalCost: 0,
          avgCost: 0,
        });
      }
      
      const position = positionMap.get(instrumentId);
      
      if (order.side === 'BUY') {
        position.quantity += size;
        position.totalCost += (size * price);
        position.avgCost = position.quantity > 0 ? position.totalCost / position.quantity : 0;
      } else if (order.side === 'SELL') {
        if (size <= position.quantity) {
          const avgBefore = position.quantity > 0 ? position.totalCost / position.quantity : 0;
          const costOut = size * avgBefore;
          
          position.quantity -= size;
          position.totalCost -= costOut;
          
          if (position.quantity === 0) {
            position.totalCost = 0;
            position.avgCost = 0;
          } else {
            position.avgCost = position.totalCost / position.quantity;
          }
        } else {
          position.quantity = 0;
          position.totalCost = 0;
          position.avgCost = 0;
        }
      }
    }
    
    return Array.from(positionMap.values()).filter(p => p.quantity > 0);
  }
}