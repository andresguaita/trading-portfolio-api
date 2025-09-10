import { CreateOrderDto } from '../dtos/create-order.dto';

export interface OrderValidator {
  validate(order: CreateOrderDto, context: ValidationContext): Promise<ValidationResult>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface ValidationContext {
  currentCash?: number;
  availableShares?: number;
  marketPrice?: number;
  derivedQuantity?: number;
  instrument?: {
    id: number;
    ticker: string;
    name: string;
    type: string;
  };
}
