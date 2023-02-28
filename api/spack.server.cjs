const { readdirSync, writeFileSync, readFileSync } = require('fs')
const { resolve } = require('path')

const spackConfig = require('./spack.config.cjs')

const services = readdirSync(resolve(__dirname, 'src', 'services'), { withFileTypes: true })
  .filter(service => {

    return !service.isDirectory() && service.name != "index.ts"
  })
  .map(service => service.name.replace(/\.ts$/g, ""));

const serviceFile = `
import type { Service } from "./lib/Service"
${services.map(s => `import { ${s} } from "./${s}"`).join("\n")}

export type Services = {
  get<T extends Service>(key: string): T
${services.map(s => `  ${s}: ${s}`).join("\n")}
}

function generateServices(): Services {
  const services: Partial<Services> = {
${services.map(s => `  ${s}: null`).join(",\n")}
  }


  const self = {
    get<T extends Service>(key: string): T {
      return (self as any)[key] as T
    }
  } as Services

${services.map(s => `  Object.defineProperty(self, "${s}", {
    get() {
      if (services.${s} === null) {
        services.${s} = new ${s}(self);
      }
      return services.${s}
    }
  });`).join("\n\n")}

  return self
}

export const services = generateServices()`

const serviceFileCurrent = readFileSync(resolve(__dirname, 'src', 'services', 'index.ts'), 'utf8')

if (serviceFileCurrent !== serviceFile) {
  writeFileSync(resolve(__dirname, 'src', 'services', 'index.ts'), serviceFile)
}

module.exports = spackConfig({
  server: __dirname + '/src/server.ts'
})