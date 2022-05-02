import express from "express";
import axios from "axios";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { APP_DATA_SERVICE_URI } from "#root/constants";

const reportsRouter = express.Router();

const client = axios.create({
  baseURL: APP_DATA_SERVICE_URI,
});

reportsRouter.route("/").get(async (req, res) => {
  const request = req as CustomRequest<{}>;

  try {
    const { data: response } = await client.post("/reports/getReportsForClient", {
      variables: {
        clientId: request.auth!.message_box_clientId,
        userId: request.auth!.message_box_userId,
      },
    });

    if (response.statusCode === 200) {
      return res.json([...response.data]);
    }

    return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
  } catch (error) {
    return res.status(500).json({ message: "application-data-service /reports network error" });
  }
});
export default reportsRouter;
