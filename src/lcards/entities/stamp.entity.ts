/**
 * 
              CREATE TABLE "lcard_stamps" (
                "id" SERIAL PRIMARY KEY,
                "lcard_id" integer NOT NULL,
                "expires_at" timestamp,
                "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
                "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
              );
              
 */

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
