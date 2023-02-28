
// import bodyParser from 'body-parser';
import { parse, serialize } from "cookie";
import { nanoid } from "nanoid";
import { Server, Socket } from 'socket.io';
import { services } from './services';


async function run() {
  const [command, ...args] = process.argv.slice(2)
  return services.Cli.run(command, args)
}

export default run()