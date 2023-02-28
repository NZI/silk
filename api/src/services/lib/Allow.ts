
export type PermChecker = (...roles: (string | TemplateStringsArray)[]) => boolean

const clientOutput: any = {

}

let _clientOutputTimer: NodeJS.Timer | null = null
const neverAllow = [
  '_allowedMethods',
  'constructor',
  '_inject',
]

export function Allow(...perms: ((R: PermChecker, P: PermChecker) => boolean)[]): any {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (process.env.CLIENT_OUTPUT) {
      const inst = propertyKey === undefined ? target.prototype : target
      const serviceName = inst.constructor.name
      if (!(serviceName in clientOutput)) {
        clientOutput[serviceName] = []
      }

      if (propertyKey === undefined) {
        clientOutput[serviceName] = Reflect.ownKeys(inst).filter((key: string | symbol) => !neverAllow.includes(key as string))
      } else if (!clientOutput[serviceName].includes(propertyKey)) {
        clientOutput[serviceName].push(propertyKey)
      }
      if (_clientOutputTimer) {
        clearTimeout(_clientOutputTimer)
      }

      _clientOutputTimer = setTimeout(async () => {
        if(!process.env.CLIENT_OUTPUT) {
          return;
        }
        const { writeFile, access, constants } = await import('fs/promises')
        const { dirname } = await import('path')
        await access(dirname(process.env.CLIENT_OUTPUT), constants.W_OK)
        const output = `
import type { Socket } from "socket.io-client";
import type { Services } from "../../api/src/services";
import { io } from "socket.io-client"

export type ClientServices = Pick<Services, ${Object.keys(clientOutput).map(service => `"${service}"`).join(" | ")}>

export default function Client(url: string): { client: ClientServices, socket: Socket } {
  let _id = 0
  const Id = () => _id++
  const promises: {
    [id: number]: {
      resolve: (result: any) => void
      reject: (result: any) => void
    }
  } = {}

  const socket = io(url, { transports: ['websocket'] })

  socket.on(":call:", (id: number, success: boolean, result: any) => {
    if (success) {
      promises[id].resolve(result)
    } else {
      promises[id].reject(result)
    }
    delete promises[id]
  })

  const serviceCallback = (serviceName: string, method: string) => {
    return (...args: any[]) => {
      return new Promise(async (resolve, reject) => {
        const id = Id()
        promises[id] = {
          resolve,
          reject,
        }
        socket.emit(":call:",
          serviceName,
          method,
          \`\${id}\`,
          args
        )
      })
    }
  }

  const client = {
${Object.keys(clientOutput).map(service => `    ${service}: {
${clientOutput[service].map((method: string) => `      ${method}: serviceCallback("${service}", "${method}"),`).join("\n")}
    },`).join("\n\n")}
  } as ClientServices

  return { client, socket }
}
`
        writeFile(process.env.CLIENT_OUTPUT, output)
      }, 1000)


    }

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