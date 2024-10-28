import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('lcard_rules')
export class LcardRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  max_stamps: number;

  @Column()
  stamps_prize: string;

  @Column()
  score_goal: number;

  @Column()
  stamps_expiration_time: number;

  @Column()
  score_expiration_time: number;

  @Column()
  score_goal_prize: string;

  @Column()
  score_booster: number;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
