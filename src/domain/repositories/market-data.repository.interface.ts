import { MarketData } from '../entities/market-data.entity';

export interface IMarketDataRepository {
  findLatestByInstrumentId(instrumentId: number): Promise<MarketData | null>;
  findLatestForInstruments(instrumentIds: number[]): Promise<MarketData[]>;
}
