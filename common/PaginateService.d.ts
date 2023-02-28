import { Service } from "./lib/Service";
export declare class Paginate extends Service {
    paginate(table: string, page: number, pageSize: number, filter: string, sortColumn: string, sort: string): Promise<{
        data: any;
        count: any;
        columns: string[];
    }>;
}
