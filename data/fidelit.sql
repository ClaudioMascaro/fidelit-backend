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
  "plan_id" integer,
  "subscription_id" integer,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "lcards" (
  "id" SERIAL PRIMARY KEY,
  "company_id" integer NOT NULL,
  "user_id" integer NOT NULL,
  "score" integer,
  "stamps" integer,
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
  "password" varchar NOT NULL,
  "salt" varchar NOT NULL,
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