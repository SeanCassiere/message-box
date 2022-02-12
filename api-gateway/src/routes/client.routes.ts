import express from "express";
import axios from "axios";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { AUTH_SERVICE_URI } from "#root/constants";

const clientRouter = express.Router();

const client = axios.create({
  baseURL: AUTH_SERVICE_URI,
});

clientRouter
  .route("/")
  .get(async (req, res) => {
    try {
      const { data: response } = await client.get("/clients/getAllClients");

      if (response.statusCode === 200) {
        return res.json([...response.data]);
      }

      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /clients network error" });
    }
  })
  .post(async (req, res) => {
    const request = req as CustomRequest<{ host: string; path: string }>;

    try {
      const { host, path, ...requestBody } = request.body;

      const { data: response } = await client.post("/clients/createClientAndUser", {
        variables: {
          host: host ?? "http://localhost:3000",
          path: path ?? "/confirm-account/",
        },
        body: { ...requestBody },
      });

      if (response.statusCode === 200) {
        return res.json({ ...response.data });
      }

      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /clients network error" });
    }
  });

clientRouter
  .route("/Users")
  .get(async (req, res) => {
    const request = req as CustomRequest<{}>;

    try {
      const { data: response } = await client.post(`/users`, {
        clientId: request.auth?.message_box_clientId,
      });

      return res.status(response.statusCode).json([...response.data]);
    } catch (error) {
      return res.status(500).json({ message: "auth-service /client network error" });
    }
  })
  .post(async (req, res) => {
    const request = req as CustomRequest<{ host: string; path: string }>;

    try {
      const { data: response } = await client.post(`/users/createUserForClient`, {
        variables: {
          clientId: request.auth?.message_box_clientId,
          host: request.body?.host ?? "http://localhost:3000",
          path: request.body?.path ?? "/confirm-account/",
        },
        body: { ...req.body },
      });

      if (response.statusCode === 200) {
        return res.json({ ...response.data });
      }

      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /client network error" });
    }
  });

clientRouter
  .route("/Roles")
  .get(async (req, res) => {
    const request = req as CustomRequest<{}>;

    try {
      const { data: response } = await client.post("/roles/getAllRolesForClient", {
        clientId: request.auth?.message_box_clientId,
      });

      if (response.statusCode === 200) {
        return res.json([...response.data]);
      }

      return res.status(response.statusCode).json({ data: [...response.data], errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /clients network error" });
    }
  })
  .post(async (req, res) => {
    const request = req as CustomRequest<{}>;

    try {
      const { data: response } = await client.post("/roles/createRoleForClient", {
        variables: { clientId: request.auth?.message_box_clientId },
        body: { ...req.body },
      });

      if (response.statusCode === 200) {
        return res.json({ ...response.data });
      }

      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /client network error" });
    }
  });

clientRouter
  .route("/Teams")
  .get(async (req, res) => {
    const request = req as CustomRequest<{}>;

    try {
      const { data: response } = await client.post("/teams/getAllTeamsForClient", {
        clientId: request.auth?.message_box_clientId,
      });

      if (response.statusCode === 200) {
        return res.json([...response.data]);
      }

      return res.status(response.statusCode).json({ data: [...response.data], errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /clients network error" });
    }
  })
  .post(async (req, res) => {
    const request = req as CustomRequest<{}>;

    try {
      const { data: response } = await client.post("/teams/createTeamForClient", {
        variables: { clientId: request.auth?.message_box_clientId },
        body: { ...req.body },
      });

      if (response.statusCode === 200) {
        return res.json({ ...response.data });
      }

      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /client network error" });
    }
  });

clientRouter.route("/Profile").get(async (req, res) => {
  const request = req as CustomRequest<{}>;

  try {
    const { data: response } = await client.post("/clients/getClientById", {
      variables: { clientId: request.auth?.message_box_clientId, userId: request.auth?.message_box_userId },
    });

    if (response.statusCode === 200) {
      return res.json({ ...response.data });
    }

    return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /client network error" });
  }
});

export default clientRouter;
