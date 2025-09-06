export class InstrumentResponseDto {
  id: number;
  ticker: string;
  name: string;
  type: string;
  
  constructor(id: number, ticker: string, name: string, type: string) {
    this.id = id;
    this.ticker = ticker;
    this.name = name;
    this.type = type;
  }
}
