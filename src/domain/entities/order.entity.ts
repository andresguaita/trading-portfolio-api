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

  @Column('varchar', { length: 10 })
  side: OrderSide;

  @Column('int')
  size: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price: number;

  @Column('varchar', { length: 10 })
  type: OrderType;

  @Column('varchar', { length: 20 })
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
