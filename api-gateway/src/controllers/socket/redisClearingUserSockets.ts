import { Server, Socket } from "socket.io";
import { redis } from "../redis";

interface I_RedisIdentifierProps {
  client_namespace: string;
  user_namespace: string;
  client_online_users_namespace: string;
}

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
  } else {
    await redis.hset(
      namespaceValues.client_namespace,
      namespaceValues.user_namespace,
      JSON.stringify(actualOnlineSocketsForUser)
    );
  }
}
