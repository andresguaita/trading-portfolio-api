import { Injectable } from '@nestjs/common';
import { OrderValidator, ValidationResult, ValidationContext } from '../interfaces/order-validator.interface';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderType } from '../../domain/value-objects/order-type.enum';

@Injectable()
export class LimitOrderValidator implements OrderValidator {
  async validate(order: CreateOrderDto, context: ValidationContext): Promise<ValidationResult> {
    if (order.type !== OrderType.LIMIT) {
      return { isValid: true, errors: [] };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    if (!order.price || order.price <= 0) {
      errors.push('El precio es requerido para órdenes LIMIT y debe ser mayor a 0');
    }

    if (order.price && context.marketPrice && context.marketPrice > 0) {
      const priceDeviation = Math.abs((order.price - context.marketPrice) / context.marketPrice) * 100;
      
      if (priceDeviation > 10) {
        warnings.push(
          `Tu precio límite (${order.price}) está ${priceDeviation.toFixed(1)}% ` +
          `alejado del precio actual de mercado ($${context.marketPrice})`
        );
      }
    }

    if (!order.quantity && !order.amount) {
      errors.push('Debes especificar cantidad o monto para órdenes LIMIT');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}
