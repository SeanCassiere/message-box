import express from "express";
import axios from "axios";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { AUTH_SERVICE_URI } from "#root/constants";

const roleRouter = express.Router();

const client = axios.create({
  baseURL: AUTH_SERVICE_URI,
});

roleRouter
  .route("/:id")
  .get(async (req, res) => {
    const request = req as CustomRequest<{}>;

    try {
      const { id } = req.params;

      const { data } = await client.post("/roles/getRoleById", { roleId: id });

      return res.status(data.statusCode).json({ ...data.data });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /client network error" });
    }
  })
  .put(async (req, res) => {
    const request = req as CustomRequest<{}>;

    const { message_box_clientId, message_box_userId } = request.auth!;
    const { id } = req.params;
    try {
      const { data: response } = await client.post("/roles/updateRoleById", {
        variables: { clientId: message_box_clientId, userId: message_box_userId, roleId: id },
        body: { ...req.body },
      });

      if (response.statusCode === 200) {
        return res.json({ ...response.data });
      }

      return res.status(response.statusCode).json({ data: response.data, errors: response.errors });
    } catch (error) {}
  })
  .delete(async (req, res) => {
    const request = req as CustomRequest<{}>;

    const { message_box_clientId, message_box_userId } = request.auth!;
    const { id } = req.params;
    try {
      const { data: response } = await client.post("/roles/deleteRoleById", {
        variables: { clientId: message_box_clientId, userId: message_box_userId, roleId: id },
        body: { ...req.body },
      });

      if (response.statusCode === 200) {
        return res.json({ ...response.data });
      }

      return res.status(response.statusCode).json({ data: response.data, errors: response.errors });
    } catch (error) {}
  });

export default roleRouter;
