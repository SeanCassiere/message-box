import { Server, Socket } from "socket.io";

import { redis, subRedis, pubRedis } from "../redis";
import { log } from "#root/utils/logger";
import { I_RedisIdentifierProps } from "./allEvents";

export async function redisOnJoinSubscribeToOnlineUsers(
  namespaceValues: I_RedisIdentifierProps,
  io: Server,
  socket: Socket
) {
  socket.join(`${namespaceValues.client_namespace}:${namespaceValues.client_online_users_namespace}`);
  socket.join(`${namespaceValues.client_namespace}:${namespaceValues.connected_chat_users_updates_subscription}`);
  console.log({
    JOINING: `${namespaceValues.client_namespace}:${namespaceValues.connected_chat_users_updates_subscription}`,
  });

  subRedis.subscribe(
    `${namespaceValues.client_namespace}:${namespaceValues.client_online_users_namespace}`,
    (err, count) => {
      if (err) {
        log.error("SubRedis:online-users", err);
      } else {
        log.info(
          `${namespaceValues.client_namespace}:${namespaceValues.client_online_users_namespace} has ${count} subscribers`
        );
      }
    }
  );

  subRedis.subscribe(
    `${namespaceValues.client_namespace}:${namespaceValues.connected_chat_users_updates_subscription}`,
    (err, count) => {
      if (err) {
        log.error("SubRedis:chat-connected-subscriptions", err);
      } else {
        log.info(
          `${namespaceValues.client_namespace}:${namespaceValues.connected_chat_users_updates_subscription} has ${count} subscribers`
        );
      }
    }
  );

  const onlineUsersForClient = await redis.hget(
    `${namespaceValues.client_namespace}`,
    `${namespaceValues.client_online_users_namespace}`
  );
  await pubRedis.publish(
    `${namespaceValues.client_namespace}:${namespaceValues.client_online_users_namespace}`,
    onlineUsersForClient ?? JSON.stringify([])
  );
}
