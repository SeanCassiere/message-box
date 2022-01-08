import express from "express";
import axios from "axios";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { validateToken } from "#root/middleware/authMiddleware";

const clientRouter = express.Router();

const client = axios.create({
  baseURL: "http://auth-service:4000",
});

clientRouter
  .route("/")
  .get(async (req: CustomRequest<{}>, res) => {
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
  .post(async (req: CustomRequest<{}>, res) => {
    try {
      const { data } = await client.post("/clients/createClientAndUser", {
        variables: { host: process.env.FRONTEND_HOST, path: "/confirm-account/" },
        body: { ...req.body },
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
  .get(validateToken, async (req: CustomRequest<{}>, res) => {
    try {
      const { data } = await client.post(`/users`, {
        clientId: req.auth?.message_box_clientId,
      });

      return res.status(data.statusCode).json([...data.data]);
    } catch (error) {
      return res.status(500).json({ message: "auth-service /client network error" });
    }
  })
  .post(validateToken, async (req: CustomRequest<{}>, res) => {
    try {
      const { data } = await client.post(`/users/createUserForClient`, {
        variables: {
          clientId: req.auth?.message_box_clientId,
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
  .get(validateToken, async (req: CustomRequest<{}>, res) => {
    try {
      const { data } = await client.post("/roles/getAllRolesForClient", { clientId: req.auth?.message_box_clientId });

      if (data.statusCode === 200) {
        return res.json([...data.data]);
      }

      return res.status(data.statusCode).json({ data: [...data.data], errors: data.errors });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /clients network error" });
    }
  })
  .post(validateToken, async (req: CustomRequest<{}>, res) => {
    try {
      const { data } = await client.post("/roles/createRoleForClient", {
        variables: { clientId: req.auth?.message_box_clientId },
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
  .get(validateToken, async (req: CustomRequest<{}>, res) => {
    try {
      const { data } = await client.post("/teams/getAllTeamsForClient", { clientId: req.auth?.message_box_clientId });

      if (data.statusCode === 200) {
        return res.json([...data.data]);
      }

      return res.status(data.statusCode).json({ data: [...data.data], errors: data.errors });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /clients network error" });
    }
  })
  .post(validateToken, async (req: CustomRequest<{}>, res) => {
    try {
      const { data } = await client.post("/teams/createTeamForClient", {
        variables: { clientId: req.auth?.message_box_clientId },
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

clientRouter.route("/Profile").get(validateToken, async (req: CustomRequest<{}>, res) => {
  try {
    const { data } = await client.post("/clients/getClientById", {
      variables: { clientId: req.auth?.message_box_clientId, userId: req.auth?.message_box_userId },
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
