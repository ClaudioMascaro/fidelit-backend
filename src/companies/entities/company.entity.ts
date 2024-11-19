import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
  plan_id: number;

  @Column()
  subscription_id: number;

  @Column()
  verified: boolean;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
