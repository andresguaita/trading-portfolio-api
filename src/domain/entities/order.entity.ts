import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Instrument } from './instrument.entity';

export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
  CASH_IN = 'CASH_IN',
  CASH_OUT = 'CASH_OUT',
}

export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
}

export enum OrderStatus {
  NEW = 'NEW',
  FILLED = 'FILLED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'instrumentId' })
  instrumentId: number;

  @Column({ name: 'userId' })
  userId: number;

  @Column({
    type: 'enum',
    enum: OrderSide,
  })
  side: OrderSide;

  @Column('decimal', { precision: 18, scale: 2 })
  size: number;

  @Column('decimal', { precision: 18, scale: 2, nullable: true })
  price: number;

  @Column({
    type: 'enum',
    enum: OrderType,
  })
  type: OrderType;

  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  status: OrderStatus;

  @CreateDateColumn()
  datetime: Date;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Instrument, instrument => instrument.orders)
  @JoinColumn({ name: 'instrumentId' })
  instrument: Instrument;
}
