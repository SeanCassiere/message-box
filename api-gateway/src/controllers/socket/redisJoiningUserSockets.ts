import { Server, Socket } from "socket.io";

import { redis } from "../redis";
import { log } from "#root/utils/logger";
import { I_RedisIdentifierProps } from "./allEvents";

export async function redisJoiningUserSockets(namespaceValues: I_RedisIdentifierProps, _: Server, socket: Socket) {
  // add user's socket to their pool in redis
  if (await redis.hexists(namespaceValues.client_namespace, namespaceValues.user_namespace)) {
    const key = (await redis.hget(namespaceValues.client_namespace, namespaceValues.user_namespace)) as string;
    const newArray = [...JSON.parse(key), socket.id];
    await redis.hset(namespaceValues.client_namespace, namespaceValues.user_namespace, JSON.stringify(newArray));
    log.info(`socket id ${socket.id} was added to ${socket.handshake.auth.userId}'s socket pool in redis`);
  } else {
    await redis.hset(namespaceValues.client_namespace, namespaceValues.user_namespace, JSON.stringify([socket.id]));
    log.info(`socket id ${socket.id} was added to a user new socket pool in redis for ${socket.handshake.auth.userId}`);
  }

  let allUserIdsOnline: string[] = [];
  // adding user to the common pool of online users
  if (await redis.hexists(namespaceValues.client_namespace, namespaceValues.client_online_users_namespace)) {
    const users = await redis.hget(namespaceValues.client_namespace, namespaceValues.client_online_users_namespace);
    const usersArray = JSON.parse(users as string) as string[];
    // if user is not in the pool, add them in
    if (!usersArray.includes(socket.handshake.auth.userId)) {
      usersArray.push(socket.handshake.auth.userId);
      allUserIdsOnline = usersArray;
      await redis.hset(
        namespaceValues.client_namespace,
        namespaceValues.client_online_users_namespace,
        JSON.stringify(usersArray)
      );
      log.info(`${socket.handshake.auth.userId} was added to the client online users pool in redis`);
    }
  } else {
    allUserIdsOnline = [socket.handshake.auth.userId];
    await redis.hset(
      namespaceValues.client_namespace,
      namespaceValues.client_online_users_namespace,
      JSON.stringify([socket.handshake.auth.userId])
    );
    log.info(`${socket.handshake.auth.userId} was added to a newly created client online users pool in redis`);
  }
}
