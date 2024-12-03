import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCompanyPlanInfo1733246938092 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "plan_status" AS ENUM ('active', 'inactive', 'canceled');
            CREATE TYPE "plan_name" AS ENUM ('FREE', 'PRO', 'PREMIUM', 'INFINITY');
            ALTER TABLE "companies"
            ADD COLUMN "plan_name" "plan_name" NOT NULL,
            ADD COLUMN "plan_status" "plan_status" NOT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "companies"
            DROP COLUMN "plan_name",
            DROP COLUMN "plan_status";
            DROP TYPE "plan_status";
            DROP TYPE "plan_name";
        `);
  }
}
