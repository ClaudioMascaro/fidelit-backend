import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { LcardRule } from './lcard-rules.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  logo: string;

  @Column()
  segment: string;

  @Column()
  website: string;

  @Column()
  email: string;

  @Column()
  cnpj: string;

  @Column()
  phone: string;

  @Column()
  main_address_id: number;

  @Column()
  lcard_rules_id: number;

  @Column()
  subscription_id: number;

  @Column()
  verified: boolean;

  @Column()
  plan_name: string;

  @Column()
  plan_status: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @OneToOne(() => Address, (address) => address.id)
  @JoinColumn({ name: 'main_address_id' })
  address: Address;

  @OneToOne(() => LcardRule, (lcardRules) => lcardRules.id)
  @JoinColumn({ name: 'lcard_rules_id' })
  lcardRules: LcardRule;
}
