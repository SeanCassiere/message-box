import express from "express";
import axios from "axios";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { APP_DATA_SERVICE_URI } from "#root/constants";
import { REDIS_CONSTANTS } from "#root/controllers/redis/constants";
import { pubRedis } from "#root/controllers/redis";

const chatsRouter = express.Router();

const client = axios.create({
  baseURL: APP_DATA_SERVICE_URI,
});

chatsRouter
  .route("/")
  .get(async (req, res) => {
    const request = req as CustomRequest<{}>;

    try {
      const { data: response } = await client.post("/chat/getAllChatRoomsForUser", {
        variables: {
          clientId: request.auth!.message_box_clientId,
          userId: request.auth!.message_box_userId,
        },
        body: {
          ownerId: request.auth!.message_box_userId,
        },
      });

      if (response.statusCode === 200) {
        return res.json([...response.data]);
      }

      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "application-data-service /chats network error" });
    }
  })
  .post(async (req, res) => {
    const request = req as CustomRequest<{}>;

    try {
      const { data: response } = await client.post("/chat/createChatRoomForUser", {
        variables: {
          clientId: request.auth!.message_box_clientId,
          userId: request.auth!.message_box_userId,
        },
        body: { ...req.body },
      });

      if (response.statusCode === 200) {
        const REDIS_KEY_ADDRESS = `${REDIS_CONSTANTS.PARENT_CLIENT_HASH_KEY}:${request.auth!.message_box_clientId}:${
          REDIS_CONSTANTS.CONNECTED_CHAT_USERS_SUBSCRIPTION_HASH_KEY
        }`;
        await pubRedis.publish(REDIS_KEY_ADDRESS, "no-data-for-this-request");
        return res.json({ ...response.data });
      }

      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "application-data-service /chats network error" });
    }
  });

chatsRouter.route("/:id/Messages").get(async (req, res) => {
  const request = req as CustomRequest<{}>;

  const roomId = request.params.id;
  const cursorValue = req.query.cursor;
  const takeSize = req.query.size;

  try {
    const { data: response } = await client.post("/chat/getMessagesForRoomById", {
      variables: {
        clientId: request.auth!.message_box_clientId,
        userId: request.auth!.message_box_userId,
        roomId: roomId,
      },
      body: {
        size: takeSize ?? null,
        cursor: cursorValue || null,
      },
    });

    if (response.statusCode === 200) {
      return res.json([...response.data]);
    }

    return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
  } catch (error) {
    return res.status(500).json({ message: "application-data-service /chats network error" });
  }
});

chatsRouter
  .route("/:id")
  .get(async (req, res) => {
    const request = req as CustomRequest<{}>;

    const roomId = request.params.id;

    try {
      const { data: response } = await client.post("/chat/getSingleChatRoomForUser", {
        variables: {
          clientId: request.auth!.message_box_clientId,
          userId: request.auth!.message_box_userId,
        },
        body: { roomId: roomId },
      });

      if (response.statusCode === 200) {
        return res.json({ ...response.data });
      }

      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "application-data-service /chats network error" });
    }
  })
  .put(async (req, res) => {
    const request = req as CustomRequest<{}>;

    const roomId = request.params.id;
    try {
      const { data: response } = await client.post("/chat/updateChatRoomForRoomId", {
        variables: {
          clientId: request.auth!.message_box_clientId,
          userId: request.auth!.message_box_userId,
          roomId: roomId,
        },
        body: { ...req.body },
      });

      if (response.statusCode === 200) {
        const REDIS_KEY_ADDRESS = `${REDIS_CONSTANTS.PARENT_CLIENT_HASH_KEY}:${request.auth!.message_box_clientId}:${
          REDIS_CONSTANTS.CONNECTED_CHAT_USERS_SUBSCRIPTION_HASH_KEY
        }`;
        await pubRedis.publish(REDIS_KEY_ADDRESS, "no-data-for-this-request");
        return res.json({ ...response.data });
      }

      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "application-data-service /chats network error" });
    }
  })
  .delete(async (req, res) => {
    const request = req as CustomRequest<{}>;

    const roomId = request.params.id;

    try {
      const { data: response } = await client.post("/chat/deleteChatRoomForRoomId", {
        variables: {
          clientId: request.auth!.message_box_clientId,
          userId: request.auth!.message_box_userId,
        },
        body: { roomId: roomId },
      });

      if (response.statusCode === 200) {
        // telling all connected users to refresh the cache
        const REDIS_KEY_ADDRESS = `${REDIS_CONSTANTS.PARENT_CLIENT_HASH_KEY}:${request.auth!.message_box_clientId}:${
          REDIS_CONSTANTS.CONNECTED_CHAT_USERS_SUBSCRIPTION_HASH_KEY
        }`;
        await pubRedis.publish(REDIS_KEY_ADDRESS, "no-data-for-this-request");

        return res.json({ ...response.data });
      }

      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "application-data-service /chats network error" });
    }
  });
export default chatsRouter;
