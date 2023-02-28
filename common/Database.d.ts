import { Services } from ".";
import { DatabaseAdapter } from "./lib/DatabaseAdapter";
export declare class Database extends DatabaseAdapter {
    private adapter;
    private DB_ADAPTER;
    constructor(services: Services);
    private getParams;
    arrayParams(paramName: string, arr: any[], prefix?: string, suffix?: string, join?: string): string;
    rollback(): Promise<any>;
    migrate(): Promise<any>;
    exec(sql: string): Promise<any>;
    selectOne(sql: string, params?: any): Promise<any>;
    all(sql: string, params?: any): Promise<any>;
    run(sql: string, params?: any): Promise<any>;
}
