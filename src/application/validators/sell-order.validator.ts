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
          `Acciones insuficientes de ${context.instrument?.ticker || 'instrumento'}. ` +
          `Disponible: ${context.availableShares}, Requerido: ${quantityToSell}`
        );
      }

      if (quantityToSell > context.availableShares * 0.8) {
        warnings.push(
          `Esta venta representará ${((quantityToSell / context.availableShares) * 100).toFixed(1)}% ` +
          `de tu posición en ${context.instrument?.ticker || 'este instrumento'}`
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
