import { Injectable, Inject } from '@nestjs/common';
import { OrderValidator, ValidationResult, ValidationContext } from '../interfaces/order-validator.interface';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { BasicOrderValidator } from '../validators/basic-order.validator';
import { BuyOrderValidator } from '../validators/buy-order.validator';
import { SellOrderValidator } from '../validators/sell-order.validator';
import { LimitOrderValidator } from '../validators/limit-order.validator';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { IInstrumentRepository } from '../../domain/repositories/instrument.repository.interface';
import { IMarketDataRepository } from '../../domain/repositories/market-data.repository.interface';
import { Order } from '../../domain/entities/order.entity';
import { OrderSide } from '../../domain/value-objects/order-side.enum';
import { OrderType } from '../../domain/value-objects/order-type.enum';

@Injectable()
export class OrderValidationService {
  private validators: OrderValidator[];

  constructor(
    private readonly basicOrderValidator: BasicOrderValidator,
    private readonly buyOrderValidator: BuyOrderValidator,
    private readonly sellOrderValidator: SellOrderValidator,
    private readonly limitOrderValidator: LimitOrderValidator,
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('IInstrumentRepository')
    private readonly instrumentRepository: IInstrumentRepository,
    @Inject('IMarketDataRepository')
    private readonly marketDataRepository: IMarketDataRepository,
  ) {
    this.validators = [
      this.basicOrderValidator,
      this.limitOrderValidator,
      this.buyOrderValidator,
      this.sellOrderValidator,
    ];
  }

  async validateOrder(order: CreateOrderDto): Promise<ValidationResult> {
    const context = await this.buildValidationContext(order);
    const results: ValidationResult[] = [];
    
    for (const validator of this.validators) {
      const result = await validator.validate(order, context);
      results.push(result);
    }

    return this.combineValidationResults(results);
  }

  private async buildValidationContext(order: CreateOrderDto): Promise<ValidationContext> {
    const context: ValidationContext = {};

    try {
      const instrument = await this.instrumentRepository.findById(order.instrumentId);
      if (instrument) {
        context.instrument = {
          id: instrument.id,
          ticker: instrument.ticker,
          name: instrument.name,
          type: instrument.type,
        };
      }

      const marketData = await this.marketDataRepository.findLatestByInstrumentId(order.instrumentId);
      if (marketData) {
        context.marketPrice = parseFloat(marketData.close.toString());
      }

      let referencePrice = 0;
      if (order.side === OrderSide.CASH_IN || order.side === OrderSide.CASH_OUT) {
        referencePrice = 1;
      } else if (order.type === OrderType.LIMIT) {
        referencePrice = order.price || 0;
      } else if (context.marketPrice) {
        referencePrice = context.marketPrice;
      }

      if (referencePrice > 0 && order.amount && !order.quantity) {
        context.derivedQuantity = Math.floor(order.amount / referencePrice);
      }

      if (order.side === OrderSide.BUY || order.side === OrderSide.SELL) {
        const ordersWithInstruments = await this.orderRepository.findFilledOrdersWithInstruments(order.userId);
        
        context.currentCash = this.calculateCashBalance(ordersWithInstruments);
        
        if (order.side === OrderSide.SELL) {
          context.availableShares = this.calculateInstrumentQuantity(ordersWithInstruments, order.instrumentId);
        }
      }

    } catch (error) {
      console.error('Error building validation context:', error);
    }

    return context;
  }

  private combineValidationResults(results: ValidationResult[]): ValidationResult {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    for (const result of results) {
      allErrors.push(...result.errors);
      if (result.warnings) {
        allWarnings.push(...result.warnings);
      }
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings.length > 0 ? allWarnings : undefined
    };
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

  private calculateInstrumentQuantity(orders: Order[], instrumentId: number): number {
    let quantity = 0;
    
    for (const order of orders) {
      if (order.instrumentId !== instrumentId) continue;
      if (order.side === 'CASH_IN' || order.side === 'CASH_OUT') continue;
      if (order.instrument.type === 'MONEDA') continue;
      
      const size = parseFloat(order.size?.toString() || '0');
      
      if (order.side === 'BUY') {
        quantity += size;
      } else if (order.side === 'SELL') {
        quantity -= size;
      }
    }
    
    return quantity;
  }
}
