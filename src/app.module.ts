import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Instrument, Order, MarketData } from './domain/entities';
import { InstrumentsController } from './infrastructure/controllers/instruments.controller';
import { PortfolioController } from './infrastructure/controllers/portfolio.controller';
import { SearchInstrumentsUseCase } from './application/use-cases/search-instruments.use-case';
import { GetAllInstrumentsUseCase } from './application/use-cases/get-all-instruments.use-case';
import { GetPortfolioUseCase } from './application/use-cases/get-portfolio.use-case';
import { InstrumentRepository } from './infrastructure/repositories/instrument.repository';
import { OrderRepository } from './infrastructure/repositories/order.repository';
import { MarketDataRepository } from './infrastructure/repositories/market-data.repository';
import { UserRepository } from './infrastructure/repositories/user.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [User, Instrument, Order, MarketData],
        synchronize: false,
        logging: false,
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false
          }
        }
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Instrument, Order, MarketData, User]),
  ],
  controllers: [InstrumentsController, PortfolioController],
  providers: [
    SearchInstrumentsUseCase,
    GetAllInstrumentsUseCase,
    GetPortfolioUseCase,
    {
      provide: 'IInstrumentRepository',
      useClass: InstrumentRepository,
    },
    {
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
    {
      provide: 'IMarketDataRepository',
      useClass: MarketDataRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
})
export class AppModule {}