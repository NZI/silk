const { config } = require('@swc/core/spack')
const { readdirSync, writeFileSync, readFileSync } = require('fs')
const { resolve } = require('path')
const pkgJson = require('./package.json')

const services = readdirSync(resolve(__dirname, 'src', 'services'), { withFileTypes: true })
  .filter(service => {

    return !service.isDirectory() && service.name != "index.ts"
  })
  .map(service => service.name.replace(/\.ts$/g, ""));

const serviceFile = `
${services.map(s => `import { ${s} } from "./${s}"`).join("\n")}

export type Services = {
${services.map(s => `  ${s}: () => ${s}`).join("\n")}
}
export type IntServices = {
${services.map(s => `  ${s}: ${s}`).join("\n")}
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

${services.map(s => `  self.${s} = () => '${s}' in services ? services['${s}'] : services['${s}'] = new ${s}(self);`).join("  \n")}
  return self
}

export const services: Services = generateServices()`

const serviceFileCurrent = readFileSync(resolve(__dirname, 'src', 'services', 'index.ts'), 'utf8')

if (serviceFileCurrent !== serviceFile) {
  writeFileSync(resolve(__dirname, 'src', 'services', 'index.ts'), serviceFile)
}

module.exports = config({
  target: "node",
  options: {
    sourceMaps: false,
    minify: false,
    jsc: {
      minify: {
        compress: {
          unused: false
        },
        mangle: false
      },

      parser: {
        syntax: "typescript",
        jsx: false,
        dynamicImport: false,
        privateMethod: true,
        functionBind: false,
        exportDefaultFrom: false,
        exportNamespaceFrom: false,
        decorators: true,
        decoratorsBeforeExport: false,
        topLevelAwait: false,
        importMeta: false,
        preserveAllComments: false
      },

    }
  },
  entry: {
    server: __dirname + '/src/server.ts'
  },
  output: {
    path: __dirname + '/dist'
  },
  module: {
  },
  externalModules: [
    ...Object.keys(pkgJson.dependencies),
    ...Object.keys(pkgJson.devDependencies),
  ]
})