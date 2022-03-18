import express from "express";
import axios from "axios";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { APP_DATA_SERVICE_URI } from "#root/constants";

const calendarEventRouter = express.Router();

const client = axios.create({
  baseURL: APP_DATA_SERVICE_URI,
});

calendarEventRouter
  .route("/")
  .get(async (req, res) => {
    const request = req as CustomRequest<{}>;

    let startDate;
    if (typeof req.query.startDate === "string") {
      startDate = req.query.startDate;
    } else {
      startDate = Array.from(req.query.startDate as any)[0];
    }

    let endDate;
    if (typeof req.query.endDate === "string") {
      endDate = req.query.endDate;
    } else {
      endDate = Array.from(req.query.endDate as any)[0];
    }

    let queryOwnerId: string | null = null;
    if (req.query.ownerId) {
      if (typeof req.query.ownerId === "string") {
        queryOwnerId = req.query.ownerId;
      } else {
        queryOwnerId = Array.from(req.query.ownerId as any)[0] as string;
      }
    }

    const ownerId = queryOwnerId ?? request.auth!.message_box_userId;

    try {
      const { data: response } = await client.post("/calendar-events/getCalendarEventsForUser", {
        variables: {
          clientId: request.auth!.message_box_clientId,
          userId: request.auth!.message_box_userId,
          ownerId: ownerId,
        },
        body: {
          startDate: startDate,
          endDate: endDate,
        },
      });

      if (response.statusCode === 200) {
        return res.json([...response.data]);
      }

      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "application-data-service /calendar-events network error" });
    }
  })
  .post(async (req, res) => {
    const request = req as CustomRequest<{}>;

    const ownerId = request.query.ownerId ?? request.auth!.message_box_userId;
    try {
      const { data: response } = await client.post("/calendar-events/createCalendarEventForUser", {
        variables: {
          clientId: request.auth!.message_box_clientId,
          userId: request.auth!.message_box_userId,
        },
        body: {
          ownerId: ownerId,
          ...request.body,
        },
      });

      if (response.statusCode === 200) {
        return res.json({ ...response.data });
      }

      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "application-data-service /calendar-events network error" });
    }
  });

calendarEventRouter
  .route("/:id")
  .get(async (req, res) => {
    const request = req as CustomRequest<{}>;

    const eventId = request.params.id;
    try {
      const { data: response } = await client.post("/calendar-events/getCalendarEventById", {
        variables: {
          clientId: request.auth!.message_box_clientId,
          userId: request.auth!.message_box_userId,
        },
        body: {
          eventId: eventId,
        },
      });

      if (response.statusCode === 200) {
        return res.json({ ...response.data });
      }

      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "application-data-service /calendar-events network error" });
    }
  })
  .put(async (req, res) => {
    const request = req as CustomRequest<{}>;

    const eventId = request.params.id;
    try {
      const { data: response } = await client.post("/calendar-events/fullUpdateCalendarEventById", {
        variables: {
          clientId: request.auth!.message_box_clientId,
          userId: request.auth!.message_box_userId,
          eventId: eventId,
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
      return res.status(500).json({ message: "application-data-service /calendar-events network error" });
    }
  })
  .patch(async (req, res) => {
    const request = req as CustomRequest<{}>;

    const eventId = request.params.id;
    try {
      const { data: response } = await client.post("/calendar-events/patchCalendarEventDetailsById", {
        variables: {
          clientId: request.auth!.message_box_clientId,
          userId: request.auth!.message_box_userId,
          eventId: eventId,
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
      return res.status(500).json({ message: "application-data-service /calendar-events network error" });
    }
  })
  .delete(async (req, res) => {
    const request = req as CustomRequest<{}>;
    const { message_box_clientId, message_box_userId } = request.auth!;
    const { id } = request.params;
    try {
      const { data: response } = await client.post("/calendar-events/deleteCalendarEventById", {
        variables: { clientId: message_box_clientId, userId: message_box_userId },
        body: { eventId: id },
      });

      if (response.statusCode === 200) {
        return res.json({ ...response.data });
      }

      return res.status(response.statusCode).json({ data: response.data, errors: response.errors });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "application-data-service /calendar-events network error" });
    }
  });
export default calendarEventRouter;
