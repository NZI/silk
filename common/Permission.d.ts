import { Service } from "./lib/Service";
export declare class Permission extends Service {
    update(id: number, column: string, value: string): Promise<boolean>;
}
