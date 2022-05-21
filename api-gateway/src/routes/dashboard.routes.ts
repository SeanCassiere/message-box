import express from "express";
import axios from "axios";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { APP_DATA_SERVICE_URI } from "#root/constants";
import { getConfigurableWidgetsForUser } from "#root/controllers/widgets/getConfigurableWidgetsForUser";
import { addPathsForWidgets } from "#root/controllers/widgets/addPathsForWidgets";

const dashboardRouter = express.Router();

const client = axios.create({
  baseURL: APP_DATA_SERVICE_URI,
});

dashboardRouter.route("/Statistics/EmployeeTaskCompletion").get(async (req, res) => {
  const request = req as CustomRequest<{}>;
  const ownerId =
    request.query.ownerId && typeof request.query.ownerId === "string"
      ? request.query.ownerId
      : request.auth!.message_box_userId;

  const clientDate =
    request.query.clientDate && typeof request.query.clientDate === "string"
      ? request.query.clientDate
      : new Date().toISOString().slice(0, 10);

  const timePeriod =
    request.query.timePeriod && typeof request.query.timePeriod === "string" ? request.query.timePeriod : "Month";

  try {
    const { data: response } = await client.post("/statistics/getEmployeeTaskCompletion", {
      variables: {
        clientId: request.auth!.message_box_clientId,
        userId: request.auth!.message_box_userId,
      },
      body: {
        ownerId: ownerId,
        clientDate: clientDate,
        timePeriod: timePeriod,
      },
    });

    if (response.statusCode === 200) {
      return res.json(response.data);
    }

    return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
  } catch (error) {
    return res.status(500).json({ message: "application-data-service /dashboard/statistics network error" });
  }
});

dashboardRouter.route("/Widgets/Available").get(async (req, res) => {
  const request = req as CustomRequest<{}>;
  const clientType =
    request.query.clientType && typeof request.query.clientType === "string" ? request.query.clientType : "web-client";
  const widgets = getConfigurableWidgetsForUser(request.auth!, clientType);
  res.status(200).json(widgets);
});

dashboardRouter
  .route("/Widgets")
  .get(async (req, res) => {
    const request = req as CustomRequest<{}>;

    const ownerId = request.query.ownerId ?? request.auth!.message_box_userId;
    const clientType =
      request.query.clientType && typeof request.query.clientType === "string"
        ? request.query.clientType
        : "web-client";

    try {
      const { data: response } = await client.post("/dashboard/getWidgetsForUser", {
        variables: {
          clientId: request.auth!.message_box_clientId,
          userId: request.auth!.message_box_userId,
        },
        body: {
          ownerId: ownerId,
          forClient: clientType,
        },
      });

      if (response.statusCode === 200) {
        const widgets = addPathsForWidgets(response.data);
        return res.json([...widgets]);
      }

      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "application-data-service /dashboard network error" });
    }
  })
  .post(async (req, res) => {
    const request = req as CustomRequest<{}>;

    const clientType =
      request.query.clientType && typeof request.query.clientType === "string"
        ? request.query.clientType
        : "web-client";

    try {
      const { data: response } = await client.post("/dashboard/createWidgetForUser", {
        variables: {
          clientId: request.auth!.message_box_clientId,
          userId: request.auth!.message_box_userId,
          forClient: clientType,
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
      return res.status(500).json({ message: "application-data-service /dashboard/widgets network error" });
    }
  })
  .patch(async (req, res) => {
    const request = req as CustomRequest<{}>;

    const clientType =
      request.query.clientType && typeof request.query.clientType === "string"
        ? request.query.clientType
        : "web-client";

    try {
      const { data: response } = await client.post("/dashboard/patchWidgetPositions", {
        variables: {
          clientId: request.auth!.message_box_clientId,
          userId: request.auth!.message_box_userId,
          forClient: clientType,
        },
        body: {
          widgets: request.body,
        },
      });

      if (response.statusCode === 200) {
        return res.json({ ...response.data });
      }

      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "application-data-service /dashboard/widgets network error" });
    }
  });

dashboardRouter.route("/Widgets/:id").delete(async (req, res) => {
  const request = req as CustomRequest<{}>;

  const widgetId = request.params.id;
  try {
    const { data: response } = await client.post("/dashboard/deleteWidgetById", {
      variables: {
        clientId: request.auth!.message_box_clientId,
        userId: request.auth!.message_box_userId,
        widgetId: widgetId,
      },
    });

    if (response.statusCode === 200) {
      return res.json({ ...response.data });
    }

    return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
  } catch (error) {
    return res.status(500).json({ message: "application-data-service /dashboard/widgets network error" });
  }
});

export default dashboardRouter;
