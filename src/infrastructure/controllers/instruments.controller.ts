import { Controller, Get, Query } from '@nestjs/common';
import { SearchInstrumentsUseCase } from '../../application/use-cases/search-instruments.use-case';
import { GetAllInstrumentsUseCase } from '../../application/use-cases/get-all-instruments.use-case';
import { SearchInstrumentsDto } from '../../application/dtos/search-instruments.dto';
import { PaginationDto } from '../../application/dtos/pagination.dto';
import { InstrumentResponseDto } from '../../application/dtos/instrument-response.dto';
import { PaginatedResponseDto } from '../../application/dtos/paginated-response.dto';

@Controller('instruments')
export class InstrumentsController {
  constructor(
    private readonly searchInstrumentsUseCase: SearchInstrumentsUseCase,
    private readonly getAllInstrumentsUseCase: GetAllInstrumentsUseCase,
  ) {}

  @Get()
  async getAllInstruments(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<InstrumentResponseDto>> {
    return await this.getAllInstrumentsUseCase.execute(paginationDto.page, paginationDto.limit);
  }

  @Get('search')
  async searchInstruments(
    @Query() searchDto: SearchInstrumentsDto,
  ): Promise<PaginatedResponseDto<InstrumentResponseDto>> {
    return await this.searchInstrumentsUseCase.execute(searchDto.query, searchDto.page, searchDto.limit);
  }
}
