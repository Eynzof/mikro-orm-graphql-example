import { Migration } from '@mikro-orm/migrations';

export class Migration20221012134259 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
    this.addSql('alter table "post" alter column "created_at" set default \'NOW()\';');
    this.addSql('alter table "post" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));');
    this.addSql('alter table "post" alter column "updated_at" set default \'NOW()\';');

    this.addSql('alter table "user" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
    this.addSql('alter table "user" alter column "created_at" set default \'NOW()\';');
    this.addSql('alter table "user" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));');
    this.addSql('alter table "user" alter column "updated_at" set default \'NOW()\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "post" alter column "created_at" set default \'2022-10-12 08:25:52.865826+00\';');
    this.addSql('alter table "post" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "post" alter column "updated_at" set default \'2022-10-12 08:25:52.865826+00\';');

    this.addSql('alter table "user" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "user" alter column "created_at" set default \'2022-10-12 08:25:52.88389+00\';');
    this.addSql('alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "user" alter column "updated_at" set default \'2022-10-12 08:25:52.88389+00\';');
  }

}
