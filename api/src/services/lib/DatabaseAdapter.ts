import { Service } from "./Service";


export abstract class DatabaseAdapter extends Service {
  public abstract exec(sql: string): Promise<any>
  public abstract all(sql: string, params?: any): Promise<any>
  public abstract run(sql: string, params?: any): Promise<any>
  public abstract selectOne(sql: string, params?: any): Promise<any>
  public abstract rollback(path: string): Promise<any>
  public abstract migrate(path: string): Promise<any>
}