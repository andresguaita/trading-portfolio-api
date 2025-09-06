import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { PortfolioResponseDto } from '../dtos/portfolio-response.dto';
import { PortfolioPositionDto } from '../dtos/portfolio-position.dto';
import { OrderSide } from '../../domain/value-objects/order-side.enum';

@Injectable()
export class GetPortfolioUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(userId: number): Promise<PortfolioResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const ordersWithData = await this.orderRepository.findFilledOrdersWithInstrumentsAndMarketData(userId);
    
    const positions = new Map<number, { quantity: number; totalCost: number; instrument: any; marketData: any }>();
    let cashPosition = 0;

    for (const order of ordersWithData) {
      if (order.instrument?.type === 'MONEDA') {
        if (order.side === OrderSide.CASH_IN) {
          cashPosition += order.size;
        } else if (order.side === OrderSide.CASH_OUT) {
          cashPosition -= order.size;
        }
      } else {
        const currentPosition = positions.get(order.instrumentId) || { 
          quantity: 0, 
          totalCost: 0, 
          instrument: order.instrument,
          marketData: order.instrument.marketData?.[0] 
        };
        
        if (order.side === OrderSide.BUY) {
          currentPosition.quantity += order.size;
          currentPosition.totalCost += order.size * order.price;
        } else if (order.side === OrderSide.SELL) {
          const avgCost = currentPosition.quantity > 0 ? currentPosition.totalCost / currentPosition.quantity : order.price;
          currentPosition.quantity -= order.size;
          currentPosition.totalCost -= order.size * avgCost;
        }
        
        if (currentPosition.quantity > 0) {
          positions.set(order.instrumentId, currentPosition);
        } else {
          positions.delete(order.instrumentId);
        }
      }
    }

    const portfolioPositions: PortfolioPositionDto[] = [];
    let totalPortfolioValue = cashPosition;

    for (const [instrumentId, position] of positions) {
      if (position.quantity <= 0 || !position.instrument || !position.marketData) continue;
      
      const currentPrice = position.marketData.close;
      const totalValue = position.quantity * currentPrice;
      const dailyReturn = ((position.marketData.close - position.marketData.previousClose) / position.marketData.previousClose) * 100;
      
      totalPortfolioValue += totalValue;
      
      portfolioPositions.push(new PortfolioPositionDto(
        instrumentId,
        position.instrument.ticker,
        position.instrument.name,
        position.quantity,
        currentPrice,
        totalValue,
        dailyReturn
      ));
    }

    return new PortfolioResponseDto(
      userId,
      totalPortfolioValue,
      cashPosition,
      portfolioPositions
    );
  }
}
