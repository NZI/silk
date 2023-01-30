
import { BookService } from "./BookService"
import { DatabaseService } from "./DatabaseService"
import { EnvService } from "./EnvService"
import { FileSessionAdapter } from "./FileSessionAdapter"
import { MemorySessionAdapter } from "./MemorySessionAdapter"
import { SessionService } from "./SessionService"
import { SqliteDatabaseAdapter } from "./SqliteDatabaseAdapter"
import { UserService } from "./UserService"

export type Services = {
  BookService: () => BookService
  DatabaseService: () => DatabaseService
  EnvService: () => EnvService
  FileSessionAdapter: () => FileSessionAdapter
  MemorySessionAdapter: () => MemorySessionAdapter
  SessionService: () => SessionService
  SqliteDatabaseAdapter: () => SqliteDatabaseAdapter
  UserService: () => UserService
}
export type IntServices = {
  BookService: BookService
  DatabaseService: DatabaseService
  EnvService: EnvService
  FileSessionAdapter: FileSessionAdapter
  MemorySessionAdapter: MemorySessionAdapter
  SessionService: SessionService
  SqliteDatabaseAdapter: SqliteDatabaseAdapter
  UserService: UserService
}

export type PermChecker = (...roles: (string|TemplateStringsArray)[]) => boolean

export function Inject(cb: (connectionData: any) => keyof typeof connectionData) {
  return (target: any, methodKey: string, parameterIndex: number) => {
    
    if (target._inject === undefined) {
      target._inject = {}
    }
    if (target._inject[methodKey] === undefined) {
      target._inject[methodKey] = {}
    }
    target._inject[methodKey].max = Math.max(target._inject[methodKey].max ?? 1, parameterIndex + 1)
    target._inject[methodKey][parameterIndex] = cb
  }
}


export function Allow(...perms: ((R: PermChecker, P: PermChecker) => boolean)[]): any {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (propertyKey === undefined) {
      if (target.prototype._allowAll === undefined) {
        target.prototype._allowAll = []
      }
      target.prototype._allowAll.push(perms)
    } else {
      if (target._allowedMethods === undefined) {
        target._allowedMethods = {}
      }
      if (!(propertyKey in target._allowedMethods)) {
        target._allowedMethods[propertyKey] = []
      }
      target._allowedMethods[propertyKey].push(perms)
    }
  }
}

export abstract class Service {
  protected services: Services;
  constructor(services: Services) {
    this.services = services;
  }
}

function generateServices(){
  const services = {} as IntServices
  const self = {} as Services

  self.BookService = () => 'BookService' in services ? services['BookService'] : services['BookService'] = new BookService(self);  
  self.DatabaseService = () => 'DatabaseService' in services ? services['DatabaseService'] : services['DatabaseService'] = new DatabaseService(self);  
  self.EnvService = () => 'EnvService' in services ? services['EnvService'] : services['EnvService'] = new EnvService(self);  
  self.FileSessionAdapter = () => 'FileSessionAdapter' in services ? services['FileSessionAdapter'] : services['FileSessionAdapter'] = new FileSessionAdapter(self);  
  self.MemorySessionAdapter = () => 'MemorySessionAdapter' in services ? services['MemorySessionAdapter'] : services['MemorySessionAdapter'] = new MemorySessionAdapter(self);  
  self.SessionService = () => 'SessionService' in services ? services['SessionService'] : services['SessionService'] = new SessionService(self);  
  self.SqliteDatabaseAdapter = () => 'SqliteDatabaseAdapter' in services ? services['SqliteDatabaseAdapter'] : services['SqliteDatabaseAdapter'] = new SqliteDatabaseAdapter(self);  
  self.UserService = () => 'UserService' in services ? services['UserService'] : services['UserService'] = new UserService(self);
  return self
}

export const services: Services = generateServices()