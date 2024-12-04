import { MigrationInterface, QueryRunner } from 'typeorm';

export class LetThereBeLight1729874026600 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "companies" (
                "id" SERIAL PRIMARY KEY,
                "name" varchar NOT NULL,
                "description" text,
                "logo" varchar,
                "segment" varchar,
                "website" varchar,
                "email" varchar NOT NULL,
                "phone" varchar,
                "cnpj" varchar NOT NULL,
                "main_address_id" integer UNIQUE,
                "lcard_rules_id" integer UNIQUE,
                "subscription_id" varchar,
                "external_customer_id" varchar,
                "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
                "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
              );
              
              CREATE TABLE "lcards" (
                "id" SERIAL PRIMARY KEY,
                "company_id" integer NOT NULL,
                "user_id" integer NOT NULL,
                "score" integer,
                "score_expires_at" timestamp,
                "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
                "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(company_id, user_id)
              );

              CREATE TABLE "lcard_stamps" (
                "id" SERIAL PRIMARY KEY,
                "lcard_id" integer NOT NULL,
                "expires_at" timestamp,
                "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
                "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
              );
              
              CREATE TABLE "users" (
                "id" SERIAL PRIMARY KEY,
                "name" varchar NOT NULL,
                "email" varchar NOT NULL UNIQUE,
                "cpf" varchar UNIQUE,
                "cnpj" varchar UNIQUE,
                "phone" varchar,
                "password" varchar,
                "salt" varchar,
                "role" varchar,
                "birthday" date,
                "company_id" integer,
                "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
                "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
              );
              
              CREATE TABLE "lcard_rules" (
                "id" SERIAL PRIMARY KEY,
                "max_stamps" integer,
                "stamps_prize" text,
                "stamps_expiration_time" integer,
                "score_expiration_time" integer,
                "score_goal" integer,
                "score_goal_prize" text,
                "score_booster" float,
                "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
                "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
              );
              
              CREATE TABLE "addresses" (
                "id" SERIAL PRIMARY KEY,
                "street" varchar NOT NULL,
                "number" varchar NOT NULL,
                "additional" varchar,
                "neighborhood" varchar NOT NULL,
                "city" varchar NOT NULL,
                "state" varchar NOT NULL,
                "zip" varchar NOT NULL,
                "country" varchar NOT NULL,
                "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
                "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
              );
              
              CREATE TABLE "sales" (
                "id" SERIAL PRIMARY KEY,
                "company_id" integer NOT NULL,
                "user_id" integer NOT NULL,
                "value" float,
                "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
                "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
              );
              `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
