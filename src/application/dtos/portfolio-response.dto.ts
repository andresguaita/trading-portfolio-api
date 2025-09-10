import { PortfolioPositionDto } from './portfolio-position.dto';

export class PortfolioResponseDto {
  constructor(
    public readonly userId: number,
    public readonly totalAccountValue: number,
    public readonly availableCash: number,
    public readonly positions: PortfolioPositionDto[],
  ) {}
}
