import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAuthorIdToTask1658359299285 implements MigrationInterface {
  name = 'addAuthorIdToTask1658359299285';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE task ADD authorId int;`);
    await queryRunner.query(
      `ALTER TABLE task ADD FOREIGN KEY fk_task_on_authorId(authorId) REFERENCES user(id);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE task DROP FOREIGN KEY task_ibfk_1;`);
    await queryRunner.query(`ALTER TABLE task DROP COLUMN authorId;`);
  }
}
