import express from "express";
import axios from "axios";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { validateToken } from "#root/middleware/authMiddleware";

const teamRouter = express.Router();

const client = axios.create({
	baseURL: "http://auth-service:4000",
});

teamRouter
	.route("/:id")
	.get(validateToken, async (req: CustomRequest<{}>, res) => {
		try {
			const { id } = req.params;

			const { data } = await client.post("/teams/getTeamById", { teamId: id });

			return res.status(data.statusCode).json({ ...data.data });
		} catch (error) {
			return res.status(500).json({ message: "auth-service /client network error" });
		}
	})
	.put(validateToken, async (req: CustomRequest<{}>, res) => {
		const { message_box_clientId, message_box_userId } = req.auth!;
		const { id } = req.params;
		try {
			const { data: response } = await client.post("/teams/updateTeamById", {
				variables: { clientId: message_box_clientId, userId: message_box_userId, teamId: id },
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
			const { data: response } = await client.post("/teams/deleteTeamById", {
				variables: { clientId: message_box_clientId, userId: message_box_userId, teamId: id },
				body: { ...req.body },
			});

			if (response.statusCode === 200) {
				return res.json({ ...response.data });
			}

			return res.status(response.statusCode).json({ data: response.data, errors: response.errors });
		} catch (error) {}
	});

export default teamRouter;
