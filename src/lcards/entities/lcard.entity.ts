import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('lcards')
export class Lcard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company_id: number;

  @Column()
  user_id: number;

  @Column()
  score: number;

  @Column()
  score_expires_at: Date;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
