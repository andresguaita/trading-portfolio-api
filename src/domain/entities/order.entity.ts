import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Instrument } from './instrument.entity';
import { OrderSide } from '../value-objects/order-side.enum';
import { OrderType } from '../value-objects/order-type.enum';
import { OrderStatus } from '../value-objects/order-status.enum';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'instrumentid' })
  instrumentId: number;

  @Column({ name: 'userid' })
  userId: number;

  @Column({ type: 'enum', enum: OrderSide })
  side: OrderSide;

  @Column('decimal', { precision: 15, scale: 2 })
  size: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'enum', enum: OrderType })
  type: OrderType;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column({ type: 'timestamp' })
  datetime: Date;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'userid' })
  user: User;

  @ManyToOne(() => Instrument, instrument => instrument.orders)
  @JoinColumn({ name: 'instrumentid' })
  instrument: Instrument;
}
