import { Server, Socket } from "socket.io";

import { pubRedis, redis } from "../redis";
import { EVENTS, I_RedisIdentifierProps } from "./allEvents";
import { log } from "#root/utils/logger";
import { I_RedisOnlineUserStatus } from "./redisJoiningUserSockets";
import { createActivityLog } from "#root/utils/createActivityLog";
import { REDIS_CONSTANTS } from "../redis/constants";

export function setupListenForUserStatusChange(namespaceValues: I_RedisIdentifierProps, io: Server, socket: Socket) {
  socket.on(EVENTS.CLIENT.PUBLISH_USER_STATUS, async ({ status, color, kickedOut }) => {
    if (await redis.hexists(namespaceValues.client_namespace, namespaceValues.client_online_users_namespace)) {
      const users = await redis.hget(namespaceValues.client_namespace, namespaceValues.client_online_users_namespace);
      let usersArray = JSON.parse(users as string) as I_RedisOnlineUserStatus[];

      let currentStatus = "Online";

      const userIndex = usersArray.findIndex((u) => u.userId === socket.handshake.auth.userId);
      if (userIndex !== -1) {
        currentStatus = usersArray[userIndex].status;

        usersArray[userIndex].status = status;
        usersArray[userIndex].color = color;
        await redis.hset(
          namespaceValues.client_namespace,
          namespaceValues.client_online_users_namespace,
          JSON.stringify(usersArray)
        );

        log.info(`${socket.handshake.auth.userId}'s status was changed to ${status}`);
      }

      // save activity log
      createActivityLog({
        clientId: socket.handshake.auth.clientId,
        userId: socket.handshake.auth.userId,
        action: "online-status-change",
        description: kickedOut
          ? `Kicked out for inactivity::${currentStatus}:In-active (${status})`
          : `Changed status from ${currentStatus} to ${status}::${currentStatus}:${status}`,
      }).then(() => {
        log.info(`ACTIVITY-LOG was created for ${socket.handshake.auth.userId} during status-change`);
      });

      await pubRedis.publish(
        `${namespaceValues.client_namespace}:${namespaceValues.client_online_users_namespace}`,
        JSON.stringify(usersArray) ?? JSON.stringify([])
      );

      const stringSocketIdsForUser = await redis.hget(
        namespaceValues.client_namespace,
        `${REDIS_CONSTANTS.USER_SOCKET_HASH_KEY}:${socket.handshake.auth?.userId}`
      );

      if (stringSocketIdsForUser) {
        const sockets = JSON.parse(stringSocketIdsForUser) as string[];
        for (const socketId of sockets) {
          io.to(`${socketId}`).emit(EVENTS.SERVER.OPEN_INACTIVITY_PROMPT, { openState: false });
        }
      }
    }
  });
}
