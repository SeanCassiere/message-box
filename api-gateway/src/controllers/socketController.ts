import { Server, Socket } from "socket.io";

import { log } from "#root/utils/logger";
import { socketTokenAuth } from "#root/middleware/authMiddleware";
import { EVENTS, I_RedisIdentifierProps } from "./socket/allEvents";
import { REDIS_CONSTANTS } from "./redis/constants";

import { redisClearUserSockets } from "./socket/redisClearingUserSockets";
import { redisJoiningUserSockets } from "./socket/redisJoiningUserSockets";
import { redisOnJoinSubscribeToOnlineUsers } from "./socket/redisOnJoinSubscribeToOnlineUsers";
import { redisOnLeaveUnsubscribeFromOnlineUsers } from "./socket/redisOnLeaveUnsubscribeFromOnlineUsers";
import { subRedis } from "./redis";
import { setupListenForUserStatusChange } from "./socket/setupListenForUserStatusChange";
import { setupListenForInactivityPrompt } from "./socket/setupListenForInactivityPrompt";
import { setupChatRoomSockets } from "./socket/setupChatRoomSockets";

export function socket({ io }: { io: Server }) {
  log.info("Socket.io is up and running 🌍");

  io.use(socketTokenAuth);

  // setup the redis subscription for the entire socket.io server instance to emit to the rooms
  subRedis.on("message", (channel, message) => {
    log.info(`\n\nSUBSCRIPTION REDIS - Channel -> ${channel}\n\n`);

    const parts = channel.split(":");

    if (parts.length === 3 && parts[2].toLowerCase() === REDIS_CONSTANTS.CLIENT_ONLINE_USERS_HASH_KEY.toLowerCase()) {
      io.to(`${channel}`).emit(EVENTS.SERVER.SEND_ONLINE_USERS, JSON.parse(message));
    }

    if (parts.length === 3 && parts[2].toLowerCase() === REDIS_CONSTANTS.CONNECTED_CHAT_USERS_SUBSCRIPTION_HASH_KEY) {
      io.to(`${channel}`).emit(EVENTS.SERVER.REFRESH_STORED_CHAT_ROOM_CACHE);
    }
  });

  io.on(EVENTS.connection, async (socket: Socket) => {
    log.info(`User ID ( ${socket.handshake.auth.userId} ) has been authenticated into the socket.io server`);

    const namespaceValues: I_RedisIdentifierProps = {
      client_namespace: `${REDIS_CONSTANTS.PARENT_CLIENT_HASH_KEY}:${socket.handshake.auth.clientId}`,
      user_namespace: `${REDIS_CONSTANTS.USER_SOCKET_HASH_KEY}:${socket.handshake.auth.userId}`,
      client_online_users_namespace: `${REDIS_CONSTANTS.CLIENT_ONLINE_USERS_HASH_KEY}`,
      connected_chat_users_updates_subscription: `${REDIS_CONSTANTS.CONNECTED_CHAT_USERS_SUBSCRIPTION_HASH_KEY}`,
    };

    await redisJoiningUserSockets(namespaceValues, io, socket);
    await redisOnJoinSubscribeToOnlineUsers(namespaceValues, io, socket);

    setupListenForUserStatusChange(namespaceValues, io, socket);
    setupListenForInactivityPrompt(namespaceValues, io, socket);

    setupChatRoomSockets(namespaceValues, io, socket);

    socket.on(EVENTS.disconnection, async () => {
      // handles removing the user from the online pool
      await redisClearUserSockets(namespaceValues, io, socket);
      await redisOnLeaveUnsubscribeFromOnlineUsers(namespaceValues, io, socket);

      log.info(`User ID ( ${socket.handshake.auth.userId} ) has disconnected from the socket.io server`);
    });
  });
}
