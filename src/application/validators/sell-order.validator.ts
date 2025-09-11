import { Injectable } from '@nestjs/common';
import { OrderValidator, ValidationResult, ValidationContext } from '../interfaces/order-validator.interface';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderSide } from '../../domain/value-objects/order-side.enum';

@Injectable()
export class SellOrderValidator implements OrderValidator {
  async validate(order: CreateOrderDto, context: ValidationContext): Promise<ValidationResult> {
    if (order.side !== OrderSide.SELL) {
      return { isValid: true, errors: [] };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    if (context.availableShares !== undefined) {
      const quantityToSell = order.quantity || context.derivedQuantity || 0;

      if (context.availableShares < quantityToSell) {
        errors.push(
          `Insufficient shares of ${context.instrument?.ticker || 'instrument'}. ` +
          `Available: ${context.availableShares}, Required: ${quantityToSell}`
        );
      }

      if (quantityToSell > context.availableShares * 0.8) {
        warnings.push(
          `This sale will represent ${((quantityToSell / context.availableShares) * 100).toFixed(1)}% ` +
          `of your position in ${context.instrument?.ticker || 'this instrument'}`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}
