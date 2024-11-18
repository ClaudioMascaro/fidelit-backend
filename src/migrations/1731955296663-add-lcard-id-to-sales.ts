import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLcardIdToSales1731955296663 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE "sales"
          ADD COLUMN "lcard_id" integer NOT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE "sales"
          DROP COLUMN "lcard_id";
        `);
  }
}
