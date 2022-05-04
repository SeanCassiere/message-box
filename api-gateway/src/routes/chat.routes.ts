import express from "express";
import axios from "axios";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { APP_DATA_SERVICE_URI } from "#root/constants";

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

  try {
    const { data: response } = await client.post("/chat/getMessagesForRoomById", {
      variables: {
        clientId: request.auth!.message_box_clientId,
        userId: request.auth!.message_box_userId,
        roomId: roomId,
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
        return res.json({ ...response.data });
      }

      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "application-data-service /chats network error" });
    }
  });
export default chatsRouter;
