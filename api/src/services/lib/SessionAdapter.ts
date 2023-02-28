import { Service } from "./Service";

export abstract class SessionAdapter extends Service {
  public abstract load(id: string): Promise<any>
  public abstract save(id: string, value: any): Promise<any>
}