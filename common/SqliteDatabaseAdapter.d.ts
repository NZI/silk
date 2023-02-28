import { Services } from ".";
import { DatabaseAdapter } from "./lib/DatabaseAdapter";
export declare class SqliteDatabaseAdapter extends DatabaseAdapter {
    getMigrationData(path: string): Promise<{
        batch: number;
        allMigrations: string[];
        currentMigrations: string[];
        lastMigrations: string[];
    }>;
    private db;
    constructor(services: Services);
    exec(sql: string): Promise<any>;
    selectOne(sql: string, params?: any): Promise<any>;
    all(sql: string, params?: any): Promise<any>;
    run(sql: string, params?: any): Promise<any>;
    rollback(path: string): Promise<void>;
    migrate(path: string): Promise<void>;
}
