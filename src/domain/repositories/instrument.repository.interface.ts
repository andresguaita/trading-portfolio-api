import { Instrument } from '../entities/instrument.entity';

export interface IInstrumentRepository {
  findById(id: number): Promise<Instrument | null>;
  findByTicker(ticker: string): Promise<Instrument | null>;
  findAll(page?: number, limit?: number): Promise<{ data: Instrument[]; total: number }>;
  search(query: string, page?: number, limit?: number): Promise<{ data: Instrument[]; total: number }>;
}
