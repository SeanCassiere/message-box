import { Server, Socket } from "socket.io";

import { redis, pubRedis } from "../redis";
import { I_RedisIdentifierProps } from "./allEvents";

export async function redisOnLeaveUnsubscribeFromOnlineUsers(
  namespaceValues: I_RedisIdentifierProps,
  _: Server,
  __: Socket
) {
  const onlineUsersForClient = await redis.hget(
    `${namespaceValues.client_namespace}`,
    `${namespaceValues.client_online_users_namespace}`
  );
  await pubRedis.publish(
    `${namespaceValues.client_namespace}:${namespaceValues.client_online_users_namespace}`,
    onlineUsersForClient ?? JSON.stringify([])
  );
}
