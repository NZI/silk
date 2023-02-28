import { Services } from ".";
import { SessionAdapter } from "./lib/SessionAdapter";
export declare class MemorySessionAdapter extends SessionAdapter {
    private data;
    constructor(services: Services);
    load(id: string): Promise<any>;
    save(id: string, value: any): Promise<void>;
}
