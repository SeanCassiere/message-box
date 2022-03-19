import { log } from "#root/utils/logger";
import { Server, Socket } from "socket.io";

import { socketTokenAuth } from "#root/middleware/authMiddleware";
import { EVENTS } from "./socket/allEvents";

export function socket({ io }: { io: Server }) {
  log.info("Socket.io is up and running 🌍");

  io.use(socketTokenAuth);

  io.on(EVENTS.connection, (socket: Socket) => {
    log.info(`User ID ( ${socket.handshake.auth.userId} ) has been authenticated into the socket.io server`);

    socket.on(EVENTS.disconnection, async () => {
      log.info(`User ID ( ${socket.handshake.auth.userId} ) has disconnected from the socket.io server`);
    });
  });
}
