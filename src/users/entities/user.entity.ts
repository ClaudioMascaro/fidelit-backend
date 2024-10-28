import { Lcard } from 'src/lcards/entities/lcard.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company_id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  cpf: string;

  @Column()
  cnpj: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  role: string;

  @Column()
  birthday: Date;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @OneToMany(() => Lcard, (lcard) => lcard.user)
  lcards: Lcard[];
}
