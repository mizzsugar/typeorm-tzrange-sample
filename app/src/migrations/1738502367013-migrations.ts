import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1738502367013 implements MigrationInterface {
    name = 'Migrations1738502367013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS btree_gist`);  // 自動生成されないので追加。gistインデックスを作成するため。
        await queryRunner.query(`CREATE TABLE "cars" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "model" character varying NOT NULL, "manufacturing_year" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fc218aa84e79b477d55322271b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reservations" ("id" SERIAL NOT NULL, "car_id" integer NOT NULL, "reservation_time" tstzrange NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3b0745cc83e9171bb36947f42d" ON "reservations" USING GiST ("reservation_time") `);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_678ef344812304c85332f36cb7d" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_678ef344812304c85332f36cb7d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3b0745cc83e9171bb36947f42d"`);
        await queryRunner.query(`DROP TABLE "reservations"`);
        await queryRunner.query(`DROP TABLE "cars"`);
    }

}
