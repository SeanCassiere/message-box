import { Server, Socket } from "socket.io";

import { log } from "#root/utils/logger";
import { socketTokenAuth } from "#root/middleware/authMiddleware";
import { EVENTS } from "./socket/allEvents";
import { REDIS_CONSTANTS } from "./redis/constants";

import { redisClearUserSockets } from "./socket/redisClearingUserSockets";
import { redisJoiningUserSockets } from "./socket/redisJoiningUserSockets";

export function socket({ io }: { io: Server }) {
  log.info("Socket.io is up and running 🌍");

  io.use(socketTokenAuth);

  io.on(EVENTS.connection, async (socket: Socket) => {
    log.info(`User ID ( ${socket.handshake.auth.userId} ) has been authenticated into the socket.io server`);

    const REDIS_CLIENT_ONLINE_KEY = `${REDIS_CONSTANTS.PARENT_CLIENT_HASH_KEY}:${socket.handshake.auth.clientId}`;
    const REDIS_USER_ONLINE_KEY = `${REDIS_CONSTANTS.USER_SOCKET_HASH_KEY}:${socket.handshake.auth.userId}`;
    const REDIS_ACTIVE_USERS_KEY = `${REDIS_CONSTANTS.CLIENT_ONLINE_USERS_HASH_KEY}`;

    await redisJoiningUserSockets(
      {
        client_namespace: REDIS_CLIENT_ONLINE_KEY,
        user_namespace: REDIS_USER_ONLINE_KEY,
        client_online_users_namespace: REDIS_ACTIVE_USERS_KEY,
      },
      io,
      socket
    );

    socket.on(EVENTS.disconnection, async () => {
      // handles removing the user from the online pool
      await redisClearUserSockets(
        {
          client_namespace: REDIS_CLIENT_ONLINE_KEY,
          user_namespace: REDIS_USER_ONLINE_KEY,
          client_online_users_namespace: REDIS_ACTIVE_USERS_KEY,
        },
        io,
        socket
      );

      log.info(`User ID ( ${socket.handshake.auth.userId} ) has disconnected from the socket.io server`);
    });
  });
}
