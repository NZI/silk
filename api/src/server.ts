
// import bodyParser from 'body-parser';
import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { Api } from "./api";
import { config } from "dotenv"
import { resolve } from "path";
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
      const user = await services.UserService().getUserAndRolesById(session.userId)
      return user
    }

    return null
  }, async (id: string) => {
    const sessionData = await services.SessionService().load(id)

    return sessionData
  })

  // migrate database
  await services.DatabaseService().migrate(
    resolve(process.cwd(), "src/migrations")
  )

  // register admin
  const admin = {
    email: services.EnvService().get("ADMIN_EMAIL"),
    password: services.EnvService().get("ADMIN_PASSWORD"),
  }
  if (admin.email && admin.password) {
    const adminId = await services.UserService().register(admin.email,admin.password);

    await services.UserService().addRoleToUser(adminId, "ADMIN", true);
  }

  httpServer.listen(4000, () => {

    console.log(`🚀  Server ready at: http://localhost:4000`);

  });
  // services.DatabaseService().rollback(resolve(process.cwd(), "src/migrations"))

}

export default run()