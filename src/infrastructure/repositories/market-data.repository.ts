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
    
    const results: MarketData[] = [];
    
    for (const instrumentId of instrumentIds) {
      const latest = await this.findLatestByInstrumentId(instrumentId);
      if (latest) {
        results.push(latest);
      }
    }
    
    return results;
  }
}
