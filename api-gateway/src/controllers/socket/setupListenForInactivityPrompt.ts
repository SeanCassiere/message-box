import { Server, Socket } from "socket.io";

import { redis } from "../redis";
import { EVENTS, I_RedisIdentifierProps } from "./allEvents";
import { log } from "#root/utils/logger";
import { createActivityLog } from "#root/utils/createActivityLog";
import { REDIS_CONSTANTS } from "../redis/constants";

export function setupListenForInactivityPrompt(namespaceValues: I_RedisIdentifierProps, io: Server, socket: Socket) {
  socket.on(EVENTS.CLIENT.ACTIVATE_INACTIVITY_PROMPT, async ({ userId, name }) => {
    const stringSockets = await redis.hget(
      namespaceValues.client_namespace,
      `${REDIS_CONSTANTS.USER_SOCKET_HASH_KEY}:${userId}`
    );
    if (stringSockets) {
      const sockets = JSON.parse(stringSockets) as string[];
      for (const socketId of sockets) {
        io.to(`${socketId}`).emit(EVENTS.SERVER.OPEN_INACTIVITY_PROMPT, { openState: true });
      }

      createActivityLog({
        clientId: socket.handshake.auth.clientId,
        userId: socket.handshake.auth.userId,
        action: "prompt-user-activity",
        description: `Prompted user ${name} to if they were online`,
      }).then(() => {
        log.info(`ACTIVITY LOG: Prompted user ${name} to if they were online`);
      });
    }
  });
}
