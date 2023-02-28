
import type { Service } from "./lib/Service"
import { Cli } from "./Cli"
import { Database } from "./Database"
import { Env } from "./Env"
import { FileSessionAdapter } from "./FileSessionAdapter"
import { MemorySessionAdapter } from "./MemorySessionAdapter"
import { Paginate } from "./Paginate"
import { Permission } from "./Permission"
import { Role } from "./Role"
import { Session } from "./Session"
import { SqliteDatabaseAdapter } from "./SqliteDatabaseAdapter"
import { User } from "./User"

export type Services = {
  get<T extends Service>(key: string): T
  Cli: Cli
  Database: Database
  Env: Env
  FileSessionAdapter: FileSessionAdapter
  MemorySessionAdapter: MemorySessionAdapter
  Paginate: Paginate
  Permission: Permission
  Role: Role
  Session: Session
  SqliteDatabaseAdapter: SqliteDatabaseAdapter
  User: User
}

function generateServices(): Services {
  const services: Partial<Services> = {
  Cli: null,
  Database: null,
  Env: null,
  FileSessionAdapter: null,
  MemorySessionAdapter: null,
  Paginate: null,
  Permission: null,
  Role: null,
  Session: null,
  SqliteDatabaseAdapter: null,
  User: null
  }


  const self = {
    get<T extends Service>(key: string): T {
      return (self as any)[key] as T
    }
  } as Services

  Object.defineProperty(self, "Cli", {
    get() {
      if (services.Cli === null) {
        services.Cli = new Cli(self);
      }
      return services.Cli
    }
  });

  Object.defineProperty(self, "Database", {
    get() {
      if (services.Database === null) {
        services.Database = new Database(self);
      }
      return services.Database
    }
  });

  Object.defineProperty(self, "Env", {
    get() {
      if (services.Env === null) {
        services.Env = new Env(self);
      }
      return services.Env
    }
  });

  Object.defineProperty(self, "FileSessionAdapter", {
    get() {
      if (services.FileSessionAdapter === null) {
        services.FileSessionAdapter = new FileSessionAdapter(self);
      }
      return services.FileSessionAdapter
    }
  });

  Object.defineProperty(self, "MemorySessionAdapter", {
    get() {
      if (services.MemorySessionAdapter === null) {
        services.MemorySessionAdapter = new MemorySessionAdapter(self);
      }
      return services.MemorySessionAdapter
    }
  });

  Object.defineProperty(self, "Paginate", {
    get() {
      if (services.Paginate === null) {
        services.Paginate = new Paginate(self);
      }
      return services.Paginate
    }
  });

  Object.defineProperty(self, "Permission", {
    get() {
      if (services.Permission === null) {
        services.Permission = new Permission(self);
      }
      return services.Permission
    }
  });

  Object.defineProperty(self, "Role", {
    get() {
      if (services.Role === null) {
        services.Role = new Role(self);
      }
      return services.Role
    }
  });

  Object.defineProperty(self, "Session", {
    get() {
      if (services.Session === null) {
        services.Session = new Session(self);
      }
      return services.Session
    }
  });

  Object.defineProperty(self, "SqliteDatabaseAdapter", {
    get() {
      if (services.SqliteDatabaseAdapter === null) {
        services.SqliteDatabaseAdapter = new SqliteDatabaseAdapter(self);
      }
      return services.SqliteDatabaseAdapter
    }
  });

  Object.defineProperty(self, "User", {
    get() {
      if (services.User === null) {
        services.User = new User(self);
      }
      return services.User
    }
  });

  return self
}

export const services = generateServices()