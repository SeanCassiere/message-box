import express from "express";
import axios from "axios";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { validateToken } from "#root/middleware/authMiddleware";

const tasksRouter = express.Router();

const client = axios.create({
  baseURL: "http://application-data-service:4000",
});

tasksRouter
  .route("/")
  .get(validateToken, async (req: CustomRequest<{}>, res) => {
    const ownerId = req.query.ownerId ?? req.auth!.message_box_userId;
    try {
      const { data } = await client.post("/tasks/getAllTasksForUser", {
        variables: {
          clientId: req.auth!.message_box_clientId,
          userId: req.auth!.message_box_userId,
        },
        body: {
          ownerId: ownerId,
        },
      });

      if (data.statusCode === 200) {
        return res.json([...data.data]);
      }

      return res.status(data.statusCode).json({ data: { ...data.data }, errors: data.errors });
    } catch (error) {
      return res.status(500).json({ message: "application-data-service /tasks network error" });
    }
  })
  .post(validateToken, async (req: CustomRequest<{}>, res) => {
    try {
      const { data } = await client.post("/tasks/createTaskForUser", {
        variables: {
          clientId: req.auth!.message_box_clientId,
          userId: req.auth!.message_box_userId,
        },
        body: {
          ...req.body,
        },
      });

      if (data.statusCode === 200) {
        return res.json({ ...data.data });
      }

      return res.status(data.statusCode).json({ data: { ...data.data }, errors: data.errors });
    } catch (error) {
      return res.status(500).json({ message: "application-data-service /tasks network error" });
    }
  });

tasksRouter
  .route("/:id")
  .get(validateToken, async (req: CustomRequest<{}>, res) => {
    const taskId = req.params.id;
    try {
      const { data } = await client.post("/tasks/getTaskById", {
        variables: {
          clientId: req.auth!.message_box_clientId,
          userId: req.auth!.message_box_userId,
        },
        body: {
          taskId: taskId,
        },
      });

      if (data.statusCode === 200) {
        return res.json({ ...data.data });
      }

      return res.status(data.statusCode).json({ data: { ...data.data }, errors: data.errors });
    } catch (error) {
      return res.status(500).json({ message: "application-data-service /tasks network error" });
    }
  })
  .delete(validateToken, async (req: CustomRequest<{}>, res) => {
    const taskId = req.params.id;
    try {
      const { data } = await client.post("/tasks/deleteTaskById", {
        variables: {
          clientId: req.auth!.message_box_clientId,
          userId: req.auth!.message_box_userId,
        },
        body: {
          taskId: taskId,
        },
      });

      if (data.statusCode === 200) {
        return res.json({ ...data.data });
      }

      return res.status(data.statusCode).json({ data: { ...data.data }, errors: data.errors });
    } catch (error) {
      return res.status(500).json({ message: "application-data-service /tasks network error" });
    }
  });

export default tasksRouter;
