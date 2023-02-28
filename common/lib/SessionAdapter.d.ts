import { Service } from "./Service";
export declare abstract class SessionAdapter extends Service {
    abstract load(id: string): Promise<any>;
    abstract save(id: string, value: any): Promise<any>;
}
