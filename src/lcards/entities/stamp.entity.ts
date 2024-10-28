import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Lcard } from './lcard.entity';

@Entity('lcard_stamps')
export class LcardStamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lcard_id: number;

  @Column()
  expires_at: Date;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @ManyToOne(() => Lcard, (lcard) => lcard.stamps)
  @JoinColumn({ name: 'lcard_id' })
  lcard: Lcard;
}
