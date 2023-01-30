import { Allow, Service } from ".";

export class BookService extends Service {

  @Allow()
  public getABook() {
    return {
      title: `About: ${Math.random()}`
    }
  }

}