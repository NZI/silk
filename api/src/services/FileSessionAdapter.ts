import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { Services } from ".";
import { SessionAdapter } from "./lib/SessionAdapter";

export class FileSessionAdapter extends SessionAdapter {
  private path: string
  private data: any
  constructor(services: Services) {
    super(services)

    this.path = this.services.Env.get('SESSION_PATH', '../data/sessions')
    this.data = {}
  }

  public async load(id: string) {
    if (!(id in this.data)) {
      const rawData = await new Promise(res => {
        readFile(resolve(this.path, `${id}.json`), 'utf8').then(d => {
          res(JSON.parse(d))
        }).catch(() => res({}))
      })
      this.data[id] = rawData
    }
    return this.data[id]
  }

  public async save(id: string, value: any) {
    await writeFile(resolve(this.path, `${id}.json`), JSON.stringify(value))
  }

}