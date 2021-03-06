import express from "express";
import axios from "axios";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { APP_DATA_SERVICE_URI } from "#root/constants";

const tasksRouter = express.Router();

const client = axios.create({
  baseURL: APP_DATA_SERVICE_URI,
});

tasksRouter
  .route("/")
  .get(async (req, res) => {
    const request = req as CustomRequest<{}>;

    const ownerId = request.query.ownerId ?? request.auth!.message_box_userId;
    const clientDate = request.query.currentDate ?? new Date().toISOString().substring(0, 10);
    const forAudience = request.query.for ?? "Today";

    try {
      const { data: response } = await client.post("/tasks/getAllTasksForUser", {
        variables: {
          clientId: request.auth!.message_box_clientId,
          userId: request.auth!.message_box_userId,
        },
        body: {
          ownerId: ownerId,
          clientDate: clientDate,
          forAudience: forAudience,
        },
      });

      if (response.statusCode === 200) {
        return res.json([...response.data]);
      }

      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "application-data-service /tasks network error" });
    }
  })
  .post(async (req, res) => {
    const request = req as CustomRequest<{}>;

    try {
      const { data: response } = await client.post("/tasks/createTaskForUser", {
        variables: {
          clientId: request.auth!.message_box_clientId,
          userId: request.auth!.message_box_userId,
        },
        body: {
          ...request.body,
        },
      });

      if (response.statusCode === 200) {
        return res.json({ ...response.data });
      }

      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "application-data-service /tasks network error" });
    }
  });

tasksRouter
  .route("/:id")
  .get(async (req, res) => {
    const request = req as CustomRequest<{}>;

    const taskId = request.params.id;
    try {
      const { data: response } = await client.post("/tasks/getTaskById", {
        variables: {
          clientId: request.auth!.message_box_clientId,
          userId: request.auth!.message_box_userId,
        },
        body: {
          taskId: taskId,
        },
      });

      if (response.statusCode === 200) {
        return res.json({ ...response.data });
      }

      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "application-data-service /tasks network error" });
    }
  })
  .put(async (req, res) => {
    const request = req as CustomRequest<{}>;

    const taskId = request.params.id;
    console.log("taskId", taskId);
    try {
      const { data: response } = await client.post("/tasks/updateTaskById", {
        variables: {
          clientId: request.auth!.message_box_clientId,
          userId: request.auth!.message_box_userId,
          taskId: taskId,
        },
        body: {
          ...request.body,
        },
      });

      if (response.statusCode === 200) {
        return res.json({ ...response.data });
      }

      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "application-data-service /tasks network error" });
    }
  })
  .delete(async (req, res) => {
    const request = req as CustomRequest<{}>;

    const taskId = request.params.id;
    try {
      const { data: response } = await client.post("/tasks/deleteTaskById", {
        variables: {
          clientId: request.auth!.message_box_clientId,
          userId: request.auth!.message_box_userId,
        },
        body: {
          taskId: taskId,
        },
      });

      if (response.statusCode === 200) {
        return res.json({ ...response.data });
      }

      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "application-data-service /tasks network error" });
    }
  });

export default tasksRouter;
