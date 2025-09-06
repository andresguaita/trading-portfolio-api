import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { MarketData } from './market-data.entity';

@Entity('instruments')
export class Instrument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  ticker: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @OneToMany(() => Order, order => order.instrument)
  orders: Order[];

  @OneToMany(() => MarketData, marketData => marketData.instrument)
  marketData: MarketData[];
}
