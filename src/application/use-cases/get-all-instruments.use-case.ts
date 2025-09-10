import { Injectable, Inject } from '@nestjs/common';
import { IInstrumentRepository } from '../../domain/repositories/instrument.repository.interface';
import { InstrumentResponseDto } from '../dtos/instrument-response.dto';
import { PaginatedResponseDto } from '../dtos/paginated-response.dto';

@Injectable()
export class GetAllInstrumentsUseCase {
  constructor(
    @Inject('IInstrumentRepository')
    private readonly instrumentRepository: IInstrumentRepository,
  ) {}

  async execute(page: number, limit: number): Promise<PaginatedResponseDto<InstrumentResponseDto>> {
    const { data: instruments, total } = await this.instrumentRepository.findAll(page, limit);
    
    const instrumentDtos = instruments.map(instrument => 
      new InstrumentResponseDto(
        instrument.id,
        instrument.ticker,
        instrument.name,
        instrument.type
      )
    );

    const totalPages = Math.ceil(total / limit);
    return new PaginatedResponseDto(instrumentDtos, total, page, limit, totalPages);
  }
}

