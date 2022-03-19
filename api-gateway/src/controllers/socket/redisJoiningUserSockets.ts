import { Server, Socket } from "socket.io";
import { redis } from "../redis";

interface I_RedisIdentifierProps {
  client_namespace: string;
  user_namespace: string;
  client_online_users_namespace: string;
}

export async function redisJoiningUserSockets(namespaceValues: I_RedisIdentifierProps, _: Server, socket: Socket) {
  // add user's socket to their pool in redis
  if (await redis.hexists(namespaceValues.client_namespace, namespaceValues.user_namespace)) {
    const key = (await redis.hget(namespaceValues.client_namespace, namespaceValues.user_namespace)) as string;
    const newArray = [...JSON.parse(key), socket.id];
    await redis.hset(namespaceValues.client_namespace, namespaceValues.user_namespace, JSON.stringify(newArray));
  } else {
    await redis.hset(namespaceValues.client_namespace, namespaceValues.user_namespace, JSON.stringify([socket.id]));
  }

  // adding user to the common pool of online users
  if (await redis.hexists(namespaceValues.client_namespace, namespaceValues.client_online_users_namespace)) {
    const users = await redis.hget(namespaceValues.client_namespace, namespaceValues.client_online_users_namespace);
    const usersArray = JSON.parse(users as string) as string[];
    // if user is not in the pool, add them in
    if (!usersArray.includes(socket.handshake.auth.userId)) {
      usersArray.push(socket.handshake.auth.userId);
      await redis.hset(
        namespaceValues.client_namespace,
        namespaceValues.client_online_users_namespace,
        JSON.stringify(usersArray)
      );
    }
  } else {
    await redis.hset(
      namespaceValues.client_namespace,
      namespaceValues.client_online_users_namespace,
      JSON.stringify([socket.handshake.auth.userId])
    );
  }
}
