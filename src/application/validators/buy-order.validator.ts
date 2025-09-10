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
          `Fondos insuficientes. Disponible: $${context.currentCash.toFixed(2)}, ` +
          `Requerido: $${requiredAmount.toFixed(2)}`
        );
      }

      if (requiredAmount > context.currentCash * 0.5) {
        warnings.push(
          `Esta orden utilizará ${((requiredAmount / context.currentCash) * 100).toFixed(1)}% ` +
          `de tu efectivo disponible`
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
