import { Services } from ".";
import { SessionAdapter } from "./lib/SessionAdapter";

export class Session extends SessionAdapter {
  private adapter: SessionAdapter
  private SESSION_ADAPTER: string

  public constructor(services: Services) {
    super(services)
    this.SESSION_ADAPTER = this.services.Env.get("SESSION_ADAPTER", "Memory")
    this.adapter = this.services.get<SessionAdapter>(`${this.SESSION_ADAPTER}SessionAdapter`)
  }



  public async load(id: string) {
    return this.adapter.load(id)
  }


  public async save(id: string, value: any) {
    return this.adapter.save(id, value)
  }

  
}