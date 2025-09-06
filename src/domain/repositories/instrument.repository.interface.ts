import { Instrument } from '../entities/instrument.entity';

export interface IInstrumentRepository {
  searchByTickerOrNamePaginated(query: string, page: number, limit: number): Promise<{ data: Instrument[]; total: number }>;
  findById(id: number): Promise<Instrument | null>;
  findAllPaginated(page: number, limit: number): Promise<{ data: Instrument[]; total: number }>;
}
