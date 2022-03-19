import { log } from "#root/utils/logger";
import { Server, Socket } from "socket.io";
import { EVENTS } from "./socket/allEvents";

export function socket({ io }: { io: Server }) {
  log.info("💪 web-sockets are up and running with Socket.io");

  io.on(EVENTS.connection, (socket: Socket) => {
    log.info(`👀 Socket ID ( ${socket.id} ) has connected to the server`);
  });
}
