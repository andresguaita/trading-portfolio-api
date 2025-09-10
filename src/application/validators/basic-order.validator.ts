import { Injectable } from '@nestjs/common';
import { OrderValidator, ValidationResult, ValidationContext } from '../interfaces/order-validator.interface';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderSide } from '../../domain/value-objects/order-side.enum';

@Injectable()
export class BasicOrderValidator implements OrderValidator {
  async validate(order: CreateOrderDto, context: ValidationContext): Promise<ValidationResult> {
    const errors: string[] = [];

    if (!order.quantity && !order.amount) {
      errors.push('Debe especificar cantidad de acciones o monto total a invertir');
    }

    if (order.quantity && order.amount) {
      errors.push('No puede especificar tanto cantidad como monto. Elija uno u otro');
    }

    if (order.quantity && order.quantity <= 0) {
      errors.push('La cantidad debe ser mayor a 0');
    }

    if (order.amount && order.amount <= 0) {
      errors.push('El monto debe ser mayor a 0');
    }

    if ((order.side === OrderSide.CASH_IN || order.side === OrderSide.CASH_OUT)) {
      if (!context.instrument || context.instrument.type !== 'MONEDA') {
        errors.push('Las transferencias de efectivo solo son válidas para instrumentos de tipo MONEDA');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
