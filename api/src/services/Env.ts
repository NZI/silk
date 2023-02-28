import { Service } from "./lib/Service"

export class Env extends Service {
  public get(key: string, d: string = "") {
    if (!(key in process.env)) {
      console.error(`process.env.${key} not set!`)
    }
    return process.env[key] ?? d
  }
}