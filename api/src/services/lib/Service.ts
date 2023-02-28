import type { Services } from ".."

export abstract class Service {
  protected services: Services;
  constructor(services: Services) {
    this.services = services;
  }
}