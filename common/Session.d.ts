import { Services } from ".";
import { SessionAdapter } from "./lib/SessionAdapter";
export declare class Session extends SessionAdapter {
    private adapter;
    private SESSION_ADAPTER;
    constructor(services: Services);
    load(id: string): Promise<any>;
    save(id: string, value: any): Promise<any>;
}
