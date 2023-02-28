
import type { Socket } from "socket.io-client";
import type { Services } from "../../api/src/services";
import { io } from "socket.io-client"

export type ClientServices = Pick<Services, "Paginate" | "Permission" | "Role" | "User">

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
          `${id}`,
          args
        )
      })
    }
  }

  const client = {
    Paginate: {
      paginate: serviceCallback("Paginate", "paginate"),
    },

    Permission: {
      update: serviceCallback("Permission", "update"),
    },

    Role: {
      update: serviceCallback("Role", "update"),
    },

    User: {
      me: serviceCallback("User", "me"),
      getVisibleUsers: serviceCallback("User", "getVisibleUsers"),
      create: serviceCallback("User", "create"),
      register: serviceCallback("User", "register"),
      updateUserPassword: serviceCallback("User", "updateUserPassword"),
      login: serviceCallback("User", "login"),
      logout: serviceCallback("User", "logout"),
      update: serviceCallback("User", "update"),
    },
  } as ClientServices

  return { client, socket }
}
