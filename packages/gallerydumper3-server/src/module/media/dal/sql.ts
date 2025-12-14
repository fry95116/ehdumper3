import { getConfig } from '../../../common/config';
import {
  ColumnType,
  Generated,
  Insertable,
  Kysely,
  Migration,
  Migrator,
  MysqlDialect,
  Selectable,
  sql,
  Updateable,
} from 'kysely';
import { MediaLibraryTypeEnum } from '../model/MediaLibrary';
import { createPool } from 'mysql2';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InlineMigrationProvider } from '../../../common/migrationProvider';

export interface Database {
  mediaLibrary: MediaLibraryTable;
}

export interface MediaLibraryTable {
  id: Generated<number>;

  created_at: Date;
  updated_at: Date;

  media_library_id: string;
  name: string;
  type: ColumnType<MediaLibraryTypeEnum, string, string>;
  writable: ColumnType<number, number, number>;

  ext_info: ColumnType<MediaLibraryTypeEnum, string, string>;
}

export type MediaLibraryDO = Selectable<MediaLibraryTable>;
export type MediaLibraryNewDO = Insertable<MediaLibraryTable>;
export type MediaLibraryUpdateDO = Updateable<MediaLibraryTable>;

const migrations: Record<string, Migration> = {
  v0: {
    async up(db) {
      await db.schema
        .createTable('mediaLibrary')
        .addColumn('id', 'bigint', (col) => col.autoIncrement().primaryKey())
        .addColumn('createAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
        .addColumn('updateAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
        .addColumn('media_library_id', sql`varchar(255)`, (col) => col.notNull().defaultTo(''))
        .addColumn('name', sql`varchar(255)`, (col) => col.notNull().defaultTo(''))
        .addColumn('type', sql`varchar(255)`, (col) => col.notNull().defaultTo(''))
        .addColumn('writable', 'boolean', (col) => col.notNull().defaultTo(1))
        .addColumn('ext_info', 'text', (col) => col.notNull().defaultTo(''))
        .execute();
      await db.schema.createIndex('idx_name').columns(['name']).execute();
      await db.schema.createIndex('idx_media_library_id').columns(['media_library_id']).execute();
    },
    async down() {},
  },
};

@Injectable()
export class SQLDAL implements OnModuleInit {
  private db: Kysely<Database>;

  async onModuleInit() {
    const dbConfig = getConfig();

    const dialect = new MysqlDialect({
      pool: createPool({
        host: dbConfig.database.host,
        port: dbConfig.database.port,
        user: dbConfig.database.user,
        password: dbConfig.database.password,
        database: dbConfig.database.database,
      }),
    });
    this.db = new Kysely<Database>({ dialect });

    const migrator = new Migrator({
      db: this.db,
      provider: new InlineMigrationProvider(migrations),
    });

    await migrator.migrateToLatest();
  }

  get dataSource() {
    return this.db;
  }
}
