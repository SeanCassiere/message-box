import express from "express";
import axios from "axios";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { validateToken } from "#root/middleware/authMiddleware";

const roleRouter = express.Router();

const client = axios.create({
  baseURL: "http://auth-service:4000",
});

roleRouter
  .route("/:id")
  .get(validateToken, async (req: CustomRequest<{}>, res) => {
    try {
      const { id } = req.params;

      const { data } = await client.post("/roles/getRoleById", { roleId: id });

      return res.status(data.statusCode).json({ ...data.data });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /client network error" });
    }
  })
  .put(validateToken, async (req: CustomRequest<{}>, res) => {
    const { message_box_clientId, message_box_userId } = req.auth!;
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
  .delete(validateToken, async (req: CustomRequest<{}>, res) => {
    const { message_box_clientId, message_box_userId } = req.auth!;
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
