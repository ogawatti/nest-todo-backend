import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTaskTable1658198918538 implements MigrationInterface {
  name = 'createTaskTable1658198918538';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`task\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(255) NOT NULL, \`done\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`task\``);
  }
}
