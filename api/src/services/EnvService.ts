import { Service } from ".";

export class EnvService extends Service {
  public get(key: string, d: string = "") {
    if (!(key in process.env)) {
      console.error(`process.env.${key} not set!`)
    }
    return process.env[key] ?? d
  }
}