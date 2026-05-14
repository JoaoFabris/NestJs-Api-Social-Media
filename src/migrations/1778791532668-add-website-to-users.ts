import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWebsiteToUsers1778791532668 implements MigrationInterface {
    name = 'AddWebsiteToUsers1778791532668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "website" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "website"`);
    }

}
