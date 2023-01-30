import { readdir, readFile } from "fs/promises";
import { resolve } from "path";
import { Service, Services } from ".";
import { DatabaseAdapter } from "./lib/DatabaseAdapter";

export class DatabaseService extends DatabaseAdapter {
  private adapter: DatabaseAdapter
  private DB_ADAPTER: string

  public constructor(services: Services) {
    super(services)
    this.DB_ADAPTER = this.services.EnvService().get("DB_ADAPTER", "Sqlite")
    this.adapter = this.services[`${this.DB_ADAPTER}DatabaseAdapter`]()

  }

  private getParams(params: any): any {
    return Object.keys(params).reduce((newP, k) => {
      newP[`:${k}`] = params[k]
      return newP
    }, {})
  }


  public async rollback(path: string) {
    return this.adapter.rollback(resolve(path, this.DB_ADAPTER.toLowerCase()))

  }

  public async migrate(path: string) {
    return this.adapter.migrate(resolve(path, this.DB_ADAPTER.toLowerCase()))
  }

  public async exec(sql: string) {
    return this.adapter.exec(sql)
  }

  public async selectOne(sql: string, params?: any) {
    return this.adapter.selectOne(sql, this.getParams(params))
  }

  public async all(sql: string, params?: any) {
    return this.adapter.all(sql, this.getParams(params))
  }

  public async run(sql: string, params?: any) {
    return this.adapter.run(sql, this.getParams(params))
  }
}