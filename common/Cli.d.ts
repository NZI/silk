import { Service } from "./lib/Service";
export declare class Cli extends Service {
    run(command: string, args: string[]): Promise<void>;
    pad(n: number): string;
    test(...name: string[]): Promise<void>;
    migrateCreate(...name: string[]): Promise<void>;
    rollback(...name: string[]): Promise<any>;
    migrate(...name: string[]): Promise<any>;
    createAdmin(...args: string[]): Promise<void>;
}
