import { Injectable } from '@nestjs/common';
import { OrderValidator, ValidationResult, ValidationContext } from '../interfaces/order-validator.interface';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderSide } from '../../domain/value-objects/order-side.enum';
import { OrderType } from '../../domain/value-objects/order-type.enum';

@Injectable()
export class BuyOrderValidator implements OrderValidator {
  async validate(order: CreateOrderDto, context: ValidationContext): Promise<ValidationResult> {
    if (order.side !== OrderSide.BUY) {
      return { isValid: true, errors: [] };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    if (context.currentCash !== undefined) {
      const finalQuantity = order.quantity || context.derivedQuantity || 0;
      const referencePrice = order.type === OrderType.LIMIT ? (order.price || 0) : (context.marketPrice || 0);
      const requiredAmount = finalQuantity * referencePrice;

      if (context.currentCash < requiredAmount) {
        errors.push(
          `Insufficient funds. Available: $${context.currentCash.toFixed(2)}, ` +
          `Required: $${requiredAmount.toFixed(2)}`
        );
      }

      if (requiredAmount > context.currentCash * 0.5) {
        warnings.push(
          `This order will use ${((requiredAmount / context.currentCash) * 100).toFixed(1)}% ` +
          `of your available cash`
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
