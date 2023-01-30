
// import bodyParser from 'body-parser';
import { parse, serialize } from "cookie";
import { nanoid } from "nanoid";
import { Server, Socket } from 'socket.io';
import { services } from './services';

async function hasAuth(roles, user: User) {
  const result = roles.filter(
    orList => orList.filter(r => {

      return r((...roles: (string | TemplateStringsArray)[]) => {
        return !roles.find(r => !user.roles.includes(r.toString()))
      }, (...permissions: (string | TemplateStringsArray)[]) => {
        return !permissions.find(r => !user.permissions.includes(r.toString()))
      })
    }).length > 0
  ).length > 0

  return result
}

type User = { roles: string[], permissions: string[] }

type UserGetter = (cookies: any, session: any) => Promise<User | null>


const allCookies: any = {

}

const allSessions: any = {

}

type SessionGetter = (id: string) => Promise<any>
type SessionSetter = (id: string, value: any) => Promise<void>

export function Api(io: Server, getUser: UserGetter, getSession: SessionGetter) {

  io.engine.on("initial_headers", (headers, request) => {
    const sessionId = request.headers['sec-websocket-key']

    let clientCookies: any = {}

    if (request.headers.cookie) {
      clientCookies = parse(request.headers.cookie)
      if ('sid' in clientCookies) {
        allCookies[sessionId] = clientCookies
        return
      }
    }

    const sid = nanoid()
    headers["set-cookie"] = serialize("sid", sid, {
      sameSite: true,
    });

    allCookies[sessionId] = {
      ...clientCookies,
      sid
    }
  });



  io.on('connection', async (socket) => {
    const sessionId = socket.handshake.headers['sec-websocket-key']
    const cookies = allCookies[sessionId]
    const session = await getSession(cookies.sid)

    socket.on(":call:", async (service, method, id, args) => {
      const user = await getUser(cookies, session)

      try {
        if (!(service in services)) {
          socket.emit(":call:", id, false, `${service}.${method}() either not found or not allowed`)
          return
        }
        const serviceInst = services[service]()

        if (!(method in serviceInst)) {
          socket.emit(":call:", id, false, `${service}.${method}() either not found or not allowed`)
          return
        }


        const serviceGuard = !serviceInst._allowAll || (
          serviceInst._allowAll.find(c => c.length === 0) || (
            user &&
            await hasAuth(serviceInst._allowAll, user)
          )
        )

        const methodGuard = serviceInst._allowedMethods && (method in serviceInst._allowedMethods) && (
          serviceInst._allowedMethods[method].find(c => c.length === 0) || (
            user &&
            await hasAuth(serviceInst._allowedMethods[method], user)
          )
        )


        if (serviceGuard && methodGuard) {
          let newArgs = []
          let injectedArgs = []
          if (serviceInst._inject && method in serviceInst._inject) {
            const inject = serviceInst._inject[method]
            for (let i = 0; i < inject.max || i < args.length; i++) {
              if (inject[i]) {
                const injectedArg = inject[i]({ user, socket, session, cookies })
                injectedArgs.push(injectedArg)
                newArgs.push(injectedArg)
              } else {
                newArgs.push(args[i])
              }
            }
          } else {
            newArgs = args
          }
          const result = serviceInst[method](...newArgs)

          if (result.then && typeof result.then === "function") {
            result.then(r => {
              socket.emit(":call:", id, true, r)
            }).catch(e => {
              console.error(e)
              socket.emit(":call:", id, false, e)
            })
          } else {
            socket.emit(":call:", id, true, result)
          }
          return
        }
        socket.emit(":call:", id, false, `${service}.${method}() not found or not allowed`)
      } catch (e) {
        console.error(e)
        socket.emit(":call:", id, false, e.message)
      }
    })

    socket.on("disconnect", () => {
      delete cookies[sessionId]
    })
  })

  return services
}