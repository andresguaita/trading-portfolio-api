import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Instrument } from '../../domain/entities/instrument.entity';
import { IInstrumentRepository } from '../../domain/repositories/instrument.repository.interface';

@Injectable()
export class InstrumentRepository implements IInstrumentRepository {
  constructor(
    @InjectRepository(Instrument)
    private readonly instrumentRepo: Repository<Instrument>,
  ) {}

  async searchByTickerOrNamePaginated(query: string, page: number, limit: number): Promise<{ data: Instrument[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const [data, total] = await this.instrumentRepo.findAndCount({
      where: [
        { ticker: Like(`%${query.toUpperCase()}%`) },
        { name: Like(`%${query}%`) }
      ],
      order: {
        ticker: 'ASC'
      },
      skip,
      take: limit
    });

    return { data, total };
  }

  async findById(id: number): Promise<Instrument | null> {
    return await this.instrumentRepo.findOne({ where: { id } });
  }

  async findByTicker(ticker: string): Promise<Instrument | null> {
    return await this.instrumentRepo.findOne({ where: { ticker } });
  }

  async findAll(page?: number, limit?: number): Promise<{ data: Instrument[]; total: number }> {
    if (page && limit) {
      return this.findAllPaginated(page, limit);
    }
    
    const [data, total] = await this.instrumentRepo.findAndCount({
      order: { ticker: 'ASC' }
    });
    
    return { data, total };
  }

  async search(query: string, page?: number, limit?: number): Promise<{ data: Instrument[]; total: number }> {
    if (page && limit) {
      return this.searchByTickerOrNamePaginated(query, page, limit);
    }
    
    const data = await this.instrumentRepo.find({
      where: [
        { ticker: Like(`%${query.toUpperCase()}%`) },
        { name: Like(`%${query}%`) }
      ],
      order: { ticker: 'ASC' }
    });
    
    return { data, total: data.length };
  }

  async findAllPaginated(page: number, limit: number): Promise<{ data: Instrument[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const [data, total] = await this.instrumentRepo.findAndCount({
      skip,
      take: limit,
      order: {
        ticker: 'ASC'
      }
    });

    return { data, total };
  }
}
