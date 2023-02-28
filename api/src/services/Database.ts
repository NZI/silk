import { resolve } from "path";
import { Services } from ".";
import { Allow } from "./lib/Allow";
import { DatabaseAdapter } from "./lib/DatabaseAdapter";

export class Database extends DatabaseAdapter {
  private adapter: DatabaseAdapter;
  private DB_ADAPTER: string;

  public constructor(services: Services) {
    super(services);
    this.DB_ADAPTER = this.services.Env.get("DB_ADAPTER", "Sqlite");
    this.adapter = this.services.get<DatabaseAdapter>(
      `${this.DB_ADAPTER}DatabaseAdapter`
    );
  }

  private getParams(params?: any): any {
    if (params === undefined) {
      return {}
    }
    return Object.keys(params).reduce<any>((newP, k) => {
      if (Array.isArray(params[k])) {
        params[k].forEach(
          (param: any, i: number) => (newP[`:${k}${i}`] = param)
        );
      } else {
        newP[`:${k}`] = params[k];
      }
      return newP;
    }, {});
  }

  public arrayParams(
    paramName: string,
    arr: any[],
    prefix: string = "",
    suffix: string = "",
    join = ","
  ): string {
    return arr.map((_, i) => `${prefix}:${paramName}${i}${suffix}`).join(join);
  }

  public async rollback() {
    return this.adapter.rollback(
      resolve(process.cwd(), "src/migrations", this.DB_ADAPTER.toLowerCase())
    );
  }

  public async migrate() {
    return this.adapter.migrate(
      resolve(process.cwd(), "src/migrations", this.DB_ADAPTER.toLowerCase())
    );
  }

  public async exec(sql: string) {
    return this.adapter.exec(sql);
  }

  public async selectOne(sql: string, params?: any) {
    return this.adapter.selectOne(sql, this.getParams(params));
  }

  public async all(sql: string, params?: any) {
    return this.adapter.all(sql, this.getParams(params));
  }

  public async run(sql: string, params?: any) {
    // console.log({
    //   sql,
    //   params: this.getParams(params),
    // });
    return this.adapter.run(sql, this.getParams(params));
  }
}
