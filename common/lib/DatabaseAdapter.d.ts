import { Service } from "./Service";
export declare abstract class DatabaseAdapter extends Service {
    abstract exec(sql: string): Promise<any>;
    abstract all(sql: string, params?: any): Promise<any>;
    abstract run(sql: string, params?: any): Promise<any>;
    abstract selectOne(sql: string, params?: any): Promise<any>;
    abstract rollback(path: string): Promise<any>;
    abstract migrate(path: string): Promise<any>;
}
