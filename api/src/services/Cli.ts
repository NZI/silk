import { Service } from "./lib/Service";
import { config } from "dotenv";
import { writeFile } from "fs/promises";
import { resolve } from "path";
config();

export class Cli extends Service {
  async run(command: string, args: string[]) {
    const availableCommands = {
      migrate: () => this.migrate(...args),
      rollback: () => this.rollback(...args),
      "create:migration": () => this.migrateCreate(...args),
      "create:admin": () => this.createAdmin(...args),
      // "create:role": () => this.createRole(...args),
      test: () => this.test(...args),
    };

    if (command in availableCommands) {
      await availableCommands[command]();
    } else {
      console.log(
        `Avaiable commands\n\n${Object.keys(availableCommands).join("\n")}`
      );
    }
  }

  pad(n: number): string {
    return n.toString().padStart(2, "0");
  }

  async test(...name: string[]) {
    const { id: parent } = await this.services
      .Database
      .selectOne(`SELECT id FROM roles WHERE name="ADMIN"`);

    const columns = ["id", "name"];
    const table = "roles";
    const parentKey = "parent";
    const childKey = "id";

    const sql = `--sql
      WITH RECURSIVE roles_roles (id, name, parent) as (
        SELECT id, name, parent
        FROM roles
        WHERE id = :parent
        UNION ALL
        SELECT r.id, r.name, r.parent
        FROM roles r
        INNER JOIN roles_roles
        ON roles_roles.parent = r.id
      )
      SELECT id, name, parent
      FROM roles_roles
      WHERE roles_roles.parent = :parent
    `

  //   const sql = `--sql
  //     WITH RECURSIVE recursor (${columns.join(",")}, ${parentKey}) as (
  //       SELECT ${columns.join(",")}, ${parentKey}
  //       FROM ${table}
  //       WHERE ${parentKey} = :parent
  //       UNION ALL
  //       SELECT ${columns.map((c) => `r.${c}`).join(",")}, r.${parentKey}
  //       FROM ${table} r
  //       INNER JOIN recursor ON r.${parentKey} = recursor.${childKey}
  //     )
  //     SELECT ${columns.join(",")}, ${parentKey}
  //     FROM ${table}
  //     WHERE ${childKey}=:parent
  //     UNION ALL
  //     SELECT ${columns.join(",")}, ${parentKey} FROM recursor
  // `;
    console.log({ sql });

    const results = await this.services.Database.all(sql, { parent });

    console.log({ results, sql });
  }

  async migrateCreate(...name: string[]) {
    const adapter = this.services.Env.get("DB_ADAPTER").toLowerCase();
    const date = new Date();
    const y = date.getFullYear();
    const mo = this.pad(date.getMonth() + 1);
    const d = this.pad(date.getDate());
    const h = this.pad(date.getHours());
    const mi = this.pad(date.getMinutes());
    const s = this.pad(date.getSeconds());
    const datetime = `${y}_${mo}_${d}__${h}_${mi}_${s}`;

    const filename = `${datetime}${name.map((word) => `_${word}`).join("")}`;

    const fullFilename = resolve(
      "src",
      "migrations",
      adapter,
      `${filename}.sql`
    );

    await writeFile(
      fullFilename,
      `

--${filename}

      `
    );

    console.log(`created migration ${fullFilename}`);
  }

  async rollback(...name: string[]) {
    return this.services.Database.rollback();
  }

  async migrate(...name: string[]) {
    return this.services.Database.migrate();
  }

  async createAdmin(...args: string[]) {
    const admin = {
      email: this.services.Env.get("ADMIN_EMAIL"),
      password: this.services.Env.get("ADMIN_PASSWORD"),
    };

    if (admin.email && admin.password) {
      await this.services
        .User
        .create(admin.email, admin.password, ["ADMIN", "asdasda", "test"], []);
    }
  }
}
