import { config } from "dotenv";
import express from "express";
import { createServer } from "http";
import { resolve } from "path";
import { Server } from "socket.io";
import { Api } from "./api";
config()

async function run() {
  const app = express()

  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cookie: true,
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });


  const services = Api(io, async (cookies: any, session: any) => {
    if ('userId' in session) {
      const user = await services.User.getUserAndRolesById(session.userId)
      console.log({user})
      return user
    }

    return null
  }, async (id: string) => {
    const sessionData = await services.Session.load(id)

    return sessionData
  })

  await services.Cli.createAdmin()

  httpServer.listen(4000, () => {

    console.log(`🚀  Server ready at: http://localhost:4000`);

  });
  // services.Database.rollback(resolve(process.cwd(), "src/migrations"))

}

export default run()