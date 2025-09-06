import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GetPortfolioUseCase } from '../../application/use-cases/get-portfolio.use-case';
import { PortfolioResponseDto } from '../../application/dtos/portfolio-response.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly getPortfolioUseCase: GetPortfolioUseCase) {}

  @Get(':userId')
  async getPortfolio(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<PortfolioResponseDto> {
    return await this.getPortfolioUseCase.execute(userId);
  }
}
