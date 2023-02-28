import { readdir, readFile } from 'fs/promises';
import { open } from 'sqlite';
import * as _sqlite3 from 'sqlite3'
import { Services } from ".";
import { DatabaseAdapter } from "./lib/DatabaseAdapter";

const sqlite3 = (_sqlite3 as any).default


export class SqliteDatabaseAdapter extends DatabaseAdapter {
  public async getMigrationData(path: string): Promise<{
    batch: number;
    allMigrations: string[]; currentMigrations: string[]; lastMigrations: string[];
  }> {
    await this.exec(`CREATE TABLE IF NOT EXISTS migration (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batch int NOT NULL,
      name varchar(255) NOT NULL
    )`)

    const currentMigrationsResult: { name: string }[] = await this.all(`SELECT name FROM migration`)
    const currentBatchResult = await this.selectOne(`SELECT MAX(batch) as batch FROM migration`)
    const batch = +(currentBatchResult.batch ?? 0)

    const lastMigrationsResult: { name: string }[] = await this.all(`SELECT name FROM migration WHERE batch = :batch`, {
      ":batch": batch
    })

    const lastMigrations = lastMigrationsResult.map(({ name }) => name)

    const currentMigrations = currentMigrationsResult.map(({ name }) => name)

    const migrationFiles = await readdir(path, { withFileTypes: true })

    const allMigrations = migrationFiles.filter(
      f => f.isFile() && /\.sql$/.test(f.name)
    ).map(({ name }) => name.replace(/\.sql$/g, ""))

    return { batch, allMigrations, currentMigrations, lastMigrations }
  }

  private db: Promise<any>
  constructor(services: Services) {
    super(services)

    const filename = this.services.Env.get("SQLITE_PATH", "./data/database.sqlite")
    this.db = open({
      driver: sqlite3.Database,
      filename,
    })
  }

  public async exec(sql: string) {
    const db = await this.db

    return await db.exec(sql)
  }


  public async selectOne(sql: string, params?: any) {
    const db = await this.db

    const r = await db.get(sql, params)

    return r
  }

  public async all(sql: string, params?: any) {
    const db = await this.db

    return db.all(sql, params)
  }

  public async run(sql: string, params?: any) {
    const db = await this.db

    return db.run(sql, params)
  }

  public async rollback(path: string) {
    const {
      lastMigrations,
    } = await this.getMigrationData(path)

    const migrationsDownSql: any = {}

    for (let i = lastMigrations.length - 1; i >= 0; i--) {
      const migration = lastMigrations[i]
      const sql = await readFile(`${path}/${migration}.sql`, "utf8")

      const [upSql, downSql] = sql.split(`--${migration}`)

      if (!upSql || !downSql) {
        throw Error("Error in " + migration + " migration")
      }
      migrationsDownSql[migration] = downSql
    }

    for (let i = lastMigrations.length - 1; i >= 0; i--) {
      const migration = lastMigrations[i]
      console.log(`rolling back migration ${migration}`)
      const sql = `BEGIN;
      ${migrationsDownSql[migration]}
      DELETE FROM migration WHERE name = "${migration}";
      COMMIT;
      `
      await this.exec(sql)
    }

  }

  public async migrate(path: string) {
    const {
      batch: nextBatch,
      allMigrations,
      currentMigrations
    } = await this.getMigrationData(path)

    const migrationsToDo = allMigrations.filter(migration => !currentMigrations.includes(migration)).sort()

    const migrationsUpSql: any = {}

    for (let i = 0; i < migrationsToDo.length; i++) {
      const migration = migrationsToDo[i]
      const sql = await readFile(`${path}/${migration}.sql`, "utf8")

      const [upSql, downSql] = sql.split(`--${migration}`)

      if (!upSql || !downSql) {
        throw Error("Error in " + migration + " migration")
      }
      migrationsUpSql[migration] = upSql
    }

    for (let i = 0; i < migrationsToDo.length; i++) {
      const migration = migrationsToDo[i]
      console.log(`running migration ${migration}`)
      const sql = `BEGIN;
      INSERT INTO migration (batch, name) VALUES (${nextBatch}, "${migration}");
      ${migrationsUpSql[migration]}
      COMMIT;
      `
      await this.exec(sql)
    }
  }
}