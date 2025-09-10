import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string; 

  @Column({ name: 'accountnumber', unique: true })
  accountNumber: string;

  @OneToMany(() => Order, order => order.user, { eager: false })
  orders: Order[];
}
