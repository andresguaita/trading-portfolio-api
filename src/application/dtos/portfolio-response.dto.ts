import { PortfolioPositionDto } from './portfolio-position.dto';

export class PortfolioResponseDto {
  userId: number;
  totalAccountValue: number;
  availableCash: number;
  positions: PortfolioPositionDto[];
  
  constructor(
    userId: number,
    totalAccountValue: number,
    availableCash: number,
    positions: PortfolioPositionDto[],
  ) {
    this.userId = userId;
    this.totalAccountValue = totalAccountValue;
    this.availableCash = availableCash;
    this.positions = positions;
  }
}
