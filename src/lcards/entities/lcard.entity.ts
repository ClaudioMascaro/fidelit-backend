import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LcardStamp } from './stamp.entity';
import { User } from 'src/users/entities/user.entity';

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

  @ManyToOne(() => User, (user) => user.lcards)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => LcardStamp, (stamp) => stamp.lcard)
  stamps: LcardStamp[];
}
