import { Services } from ".";
import { SessionAdapter } from "./lib/SessionAdapter";

export class MemorySessionAdapter extends SessionAdapter {
  private data: any

  constructor(services: Services) {
    super(services)
    this.data = {}
  }

  public async load(id: string) {
    this.data[id] = {}
    return this.data[id]
  }

  public async save(id: string, value: any) {
    this.data[id] = value
  }

}