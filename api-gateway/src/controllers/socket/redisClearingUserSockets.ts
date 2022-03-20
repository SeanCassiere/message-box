import { Server, Socket } from "socket.io";

import { redis, pubRedis, subRedis } from "../redis";
import { log } from "#root/utils/logger";
import { I_RedisIdentifierProps } from "./allEvents";

export async function redisClearUserSockets(namespaceValues: I_RedisIdentifierProps, io: Server, socket: Socket) {
  // remove socket from redis
  const key = (await redis.hget(namespaceValues.client_namespace, namespaceValues.user_namespace)) as string;
  const userSocketsWithoutCurrent = Array.from(JSON.parse(key)).filter((id) => id !== socket.id);

  let actualOnlineSocketsForUser = [];
  for (const sock in userSocketsWithoutCurrent) {
    if (io.sockets.sockets.hasOwnProperty(sock)) {
      actualOnlineSocketsForUser.push(sock);
    }
  }

  if (actualOnlineSocketsForUser.length === 0) {
    await redis.hdel(namespaceValues.client_namespace, namespaceValues.user_namespace);
    log.info(`${socket.handshake.auth.userId}'s sockets were cleared/deleted from redis`);

    // if no more users are connected to the client, remove the user from the client pool
    const onlineUsers = await redis.hget(
      namespaceValues.client_namespace,
      namespaceValues.client_online_users_namespace
    );
    const onlineUsersArray = JSON.parse(onlineUsers as string) as string[];
    const nowOnlineUsersArray = onlineUsersArray.filter((id) => id !== socket.handshake.auth.userId);
    await redis.hset(
      namespaceValues.client_namespace,
      namespaceValues.client_online_users_namespace,
      JSON.stringify(nowOnlineUsersArray)
    );
    log.info(`${socket.handshake.auth.userId}'s was removed from the client online users pool in redis`);
  } else {
    await redis.hset(
      namespaceValues.client_namespace,
      namespaceValues.user_namespace,
      JSON.stringify(actualOnlineSocketsForUser)
    );
    log.info(`socket id ${socket.id} was removed from ${socket.handshake.auth.userId}'s socket pool in redis`);
  }
}
