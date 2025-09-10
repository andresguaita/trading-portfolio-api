export class PortfolioPositionDto {
  instrumentId: number;
  ticker: string;
  name: string;
  quantity: number;
  currentPrice: number;
  avgCost: number;
  totalValue: number;
  totalReturn: number;
  dailyReturn: number;
  
  constructor(
    instrumentId: number,
    ticker: string,
    name: string,
    quantity: number,
    currentPrice: number,
    avgCost: number,
    totalValue: number,
    totalReturn: number,
    dailyReturn: number,
  ) {
    this.instrumentId = instrumentId;
    this.ticker = ticker;
    this.name = name;
    this.quantity = quantity;
    this.currentPrice = currentPrice;
    this.avgCost = avgCost;
    this.totalValue = totalValue;
    this.totalReturn = totalReturn;
    this.dailyReturn = dailyReturn;
  }
}
