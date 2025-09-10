import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MarketData } from '../../domain/entities/market-data.entity';
import { IMarketDataRepository } from '../../domain/repositories/market-data.repository.interface';

@Injectable()
export class MarketDataRepository implements IMarketDataRepository {
  constructor(
    @InjectRepository(MarketData)
    private readonly marketDataRepo: Repository<MarketData>,
  ) {}

  async findLatestByInstrumentId(instrumentId: number): Promise<MarketData | null> {
    return await this.marketDataRepo.findOne({
      where: { instrumentId },
      order: { datetime: 'DESC' }
    });
  }

  async findLatestForInstruments(instrumentIds: number[]): Promise<MarketData[]> {
    if (instrumentIds.length === 0) return [];
    
    const query = `
      SELECT md.id, md.instrumentid as "instrumentId", md.high, md.low, md.open, md.close, md.previousclose as "previousClose", md.date as datetime
      FROM marketdata md 
      WHERE md.instrumentid = ANY($1)
      AND md.date = (SELECT MAX(md2.date) FROM marketdata md2 WHERE md2.instrumentid = md.instrumentid)
      ORDER BY md.instrumentid ASC
    `;
    
    const rawResult = await this.marketDataRepo.query(query, [instrumentIds]);
    
    return rawResult.map(row => {
      const marketData = new MarketData();
      marketData.id = row.id;
      marketData.instrumentId = row.instrumentId;
      marketData.high = parseFloat(row.high);
      marketData.low = parseFloat(row.low);
      marketData.open = parseFloat(row.open);
      marketData.close = parseFloat(row.close);
      marketData.previousClose = parseFloat(row.previousClose);
      marketData.datetime = new Date(row.datetime);
      return marketData;
    });
  }
}
