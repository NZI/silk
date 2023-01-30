import { io, Socket } from "socket.io-client";
import type { Services } from "./services";

export function Client(url: string): { client: Services, socket: Socket } {
  let _id = 0
  const Id = () => _id++
  const promises: any = {}
  const inst: any = {}

  const socket = io(url, { transports: ['websocket'] })

  socket.on(":call:", (id, success, result) => {
    if (success) {
      promises[id].resolve(result)
    } else {
      promises[id].reject(result)
    }
    delete promises[id]
  })

  const client = new Proxy({}, {
    get(_, service) {

      return service in inst ? inst[service] : inst[service] = () => new Proxy({}, {
        get(_, method) {
          return (...args: any[]) => {
            return new Promise(async (resolve, reject) => {
              const id = Id()
              promises[id] = {
                resolve,
                reject,
                id,
              }
              socket.emit(":call:",
                service.toString(),
                method,
                `${id}`,
                args
              )
            })
          }
        },
      })
    },
  }) as Services

  return {
    client,
    socket,
  }
}