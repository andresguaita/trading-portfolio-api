import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Instrument } from './instrument.entity';

@Entity('marketdata')
export class MarketData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'instrumentid' })
  instrumentId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  high: number;

  @Column('decimal', { precision: 10, scale: 2 })
  low: number;

  @Column('decimal', { precision: 10, scale: 2 })
  open: number;

  @Column('decimal', { precision: 10, scale: 2 })
  close: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'previousclose' })
  previousClose: number;

  @Column({ type: 'date', name: 'date' })
  datetime: Date;

  @ManyToOne(() => Instrument, instrument => instrument.marketData)
  @JoinColumn({ name: 'instrumentid' })
  instrument: Instrument;
}
