import { Server, Socket } from "socket.io";

import { redis } from "../redis";
import { log } from "#root/utils/logger";
import { I_RedisIdentifierProps } from "./allEvents";
import { REDIS_CONSTANTS } from "../redis/constants";
import { createActivityLog } from "#root/utils/createActivityLog";
import { string } from "yup";

export interface I_RedisOnlineUserStatus {
  userId: string;
  status: string;
  color: string;
}

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

    createActivityLog({
      clientId: socket.handshake.auth.clientId,
      userId: socket.handshake.auth.userId,
      action: "login",
      description: "User logged in to websocket server",
    }).then(() => {
      log.info(`ACTIVITY-LOG was created for ${socket.handshake.auth.userId} during login`);
    });

    createActivityLog({
      clientId: socket.handshake.auth.clientId,
      userId: socket.handshake.auth.userId,
      action: "online-status-change",
      description: `Changed status from Offline to Online::Offline:Online`,
    }).then(() => {
      log.info(`ACTIVITY-LOG was created for ${socket.handshake.auth.userId} during initial connection`);
    });
  }

  let allUserStatusOnline: I_RedisOnlineUserStatus[] = [];
  // adding user to the common pool of online users
  if (await redis.hexists(namespaceValues.client_namespace, namespaceValues.client_online_users_namespace)) {
    const users = await redis.hget(namespaceValues.client_namespace, namespaceValues.client_online_users_namespace);
    const usersArray = JSON.parse(users as string) as I_RedisOnlineUserStatus[];
    // if user is not in the pool, add them in
    if (!usersArray.map((u) => u.userId).includes(socket.handshake.auth.userId)) {
      usersArray.push({
        userId: socket.handshake.auth.userId,
        status: REDIS_CONSTANTS.INITIAL_USER_STATUS,
        color: REDIS_CONSTANTS.INITIAL_USER_STATUS_COLOR,
      });
      allUserStatusOnline = usersArray;
      await redis.hset(
        namespaceValues.client_namespace,
        namespaceValues.client_online_users_namespace,
        JSON.stringify(usersArray)
      );
      log.info(`${socket.handshake.auth.userId} was added to the client online users pool in redis`);
    }
  } else {
    allUserStatusOnline = [
      {
        userId: socket.handshake.auth.userId,
        status: REDIS_CONSTANTS.INITIAL_USER_STATUS,
        color: REDIS_CONSTANTS.INITIAL_USER_STATUS_COLOR,
      },
    ];
    await redis.hset(
      namespaceValues.client_namespace,
      namespaceValues.client_online_users_namespace,
      JSON.stringify([{ userId: socket.handshake.auth.userId, status: REDIS_CONSTANTS.INITIAL_USER_STATUS }])
    );
    log.info(`${socket.handshake.auth.userId} was added to a newly created client online users pool in redis`);
  }
}
