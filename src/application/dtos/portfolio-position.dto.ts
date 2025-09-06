export class PortfolioPositionDto {
  instrumentId: number;
  ticker: string;
  name: string;
  quantity: number;
  currentPrice: number;
  totalValue: number;
  dailyReturn: number;
  
  constructor(
    instrumentId: number,
    ticker: string,
    name: string,
    quantity: number,
    currentPrice: number,
    totalValue: number,
    dailyReturn: number,
  ) {
    this.instrumentId = instrumentId;
    this.ticker = ticker;
    this.name = name;
    this.quantity = quantity;
    this.currentPrice = currentPrice;
    this.totalValue = totalValue;
    this.dailyReturn = dailyReturn;
  }
}
