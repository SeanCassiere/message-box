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
      const { data } = await client.get("/clients/getAllClients");

      if (data.statusCode === 200) {
        return res.json([...data.data]);
      }

      return res.status(data.statusCode).json({ data: { ...data.data }, errors: data.errors });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /clients network error" });
    }
  })
  .post(async (req, res) => {
    const request = req as CustomRequest<{}>;

    try {
      const { data } = await client.post("/clients/createClientAndUser", {
        variables: { host: process.env.FRONTEND_HOST, path: "/confirm-account/" },
        body: { ...request.body },
      });

      if (data.statusCode === 200) {
        return res.json({ ...data.data });
      }

      return res.status(data.statusCode).json({ data: { ...data.data }, errors: data.errors });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /clients network error" });
    }
  });

clientRouter
  .route("/Users")
  .get(async (req, res) => {
    const request = req as CustomRequest<{}>;

    try {
      const { data } = await client.post(`/users`, {
        clientId: request.auth?.message_box_clientId,
      });

      return res.status(data.statusCode).json([...data.data]);
    } catch (error) {
      return res.status(500).json({ message: "auth-service /client network error" });
    }
  })
  .post(async (req, res) => {
    const request = req as CustomRequest<{}>;

    try {
      const { data } = await client.post(`/users/createUserForClient`, {
        variables: {
          clientId: request.auth?.message_box_clientId,
          host: process.env.FRONTEND_HOST,
          path: "/confirm-account/",
        },
        body: { ...req.body },
      });

      if (data.statusCode === 200) {
        return res.json({ ...data.data });
      }

      return res.status(data.statusCode).json({ data: { ...data.data }, errors: data.errors });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /client network error" });
    }
  });

clientRouter
  .route("/Roles")
  .get(async (req, res) => {
    const request = req as CustomRequest<{}>;

    try {
      const { data } = await client.post("/roles/getAllRolesForClient", {
        clientId: request.auth?.message_box_clientId,
      });

      if (data.statusCode === 200) {
        return res.json([...data.data]);
      }

      return res.status(data.statusCode).json({ data: [...data.data], errors: data.errors });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /clients network error" });
    }
  })
  .post(async (req, res) => {
    const request = req as CustomRequest<{}>;

    try {
      const { data } = await client.post("/roles/createRoleForClient", {
        variables: { clientId: request.auth?.message_box_clientId },
        body: { ...req.body },
      });

      if (data.statusCode === 200) {
        return res.json({ ...data.data });
      }

      return res.status(data.statusCode).json({ data: { ...data.data }, errors: data.errors });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /client network error" });
    }
  });

clientRouter
  .route("/Teams")
  .get(async (req, res) => {
    const request = req as CustomRequest<{}>;

    try {
      const { data } = await client.post("/teams/getAllTeamsForClient", {
        clientId: request.auth?.message_box_clientId,
      });

      if (data.statusCode === 200) {
        return res.json([...data.data]);
      }

      return res.status(data.statusCode).json({ data: [...data.data], errors: data.errors });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /clients network error" });
    }
  })
  .post(async (req, res) => {
    const request = req as CustomRequest<{}>;

    try {
      const { data } = await client.post("/teams/createTeamForClient", {
        variables: { clientId: request.auth?.message_box_clientId },
        body: { ...req.body },
      });

      if (data.statusCode === 200) {
        return res.json({ ...data.data });
      }

      return res.status(data.statusCode).json({ data: { ...data.data }, errors: data.errors });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /client network error" });
    }
  });

clientRouter.route("/Profile").get(async (req, res) => {
  const request = req as CustomRequest<{}>;

  try {
    const { data } = await client.post("/clients/getClientById", {
      variables: { clientId: request.auth?.message_box_clientId, userId: request.auth?.message_box_userId },
    });

    if (data.statusCode === 200) {
      return res.json({ ...data.data });
    }

    return res.status(data.statusCode).json({ data: { ...data.data }, errors: data.errors });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /client network error" });
  }
});

export default clientRouter;
