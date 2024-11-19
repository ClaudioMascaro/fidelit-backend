import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVerifiedCompanies1732039350293 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "companies"
            ADD COLUMN "verified" boolean NOT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "companies"
            DROP COLUMN "verified;
        `);
  }
}
