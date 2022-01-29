import express from "express";
import axios from "axios";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { AUTH_SERVICE_URI } from "#root/constants";

const teamRouter = express.Router();

const client = axios.create({
  baseURL: AUTH_SERVICE_URI,
});

teamRouter
  .route("/:id")
  .get(async (req, res) => {
    const request = req as CustomRequest<{}>;
    try {
      const { id } = request.params;

      const { data: response } = await client.post("/teams/getTeamById", { teamId: id });

      return res.status(response.statusCode).json({ ...response.data });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /client network error" });
    }
  })
  .put(async (req, res) => {
    const request = req as CustomRequest<{}>;
    const { message_box_clientId, message_box_userId } = request.auth!;
    const { id } = request.params;
    try {
      const { data: response } = await client.post("/teams/updateTeamById", {
        variables: { clientId: message_box_clientId, userId: message_box_userId, teamId: id },
        body: { ...request.body },
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
    const { id } = request.params;
    try {
      const { data: response } = await client.post("/teams/deleteTeamById", {
        variables: { clientId: message_box_clientId, userId: message_box_userId, teamId: id },
        body: { ...request.body },
      });

      if (response.statusCode === 200) {
        return res.json({ ...response.data });
      }

      return res.status(response.statusCode).json({ data: response.data, errors: response.errors });
    } catch (error) {}
  });

export default teamRouter;
