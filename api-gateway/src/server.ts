import express, { NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import morgan from "morgan";
import axios from "axios";

import swaggerDocument from "./swagger.json";

import authenticationRouter from "./routes/authentication.routes";
import userRouter from "./routes/user.routes";
import clientRouter from "./routes/client.routes";
import roleRouter from "./routes/roles.routes";
import teamRouter from "./routes/teams.routes";

const expressApp = express();

expressApp.use(cors({ origin: (_, cb) => cb(null, true), credentials: true }));
expressApp.use(helmet());
expressApp.use(cookieParser(process.env.COOKIE_SECRET));
expressApp.use(express.json());

expressApp.use(morgan("tiny"));

expressApp.get("/docs/swagger.json", (_, res) => {
	return res.status(200).send(swaggerDocument);
});

const swaggerOptions = {
	swaggerOptions: {
		url: `/docs/swagger.json`,
	},
};
expressApp.use("/docs", swaggerUI.serveFiles(undefined, swaggerOptions), swaggerUI.setup(undefined, swaggerOptions));

expressApp.use("/Api/Authentication", authenticationRouter);
expressApp.use("/Api/Users", userRouter);
expressApp.use("/Api/Clients", clientRouter);
expressApp.use("/Api/Roles", roleRouter);
expressApp.use("/Api/Teams", teamRouter);

expressApp.get("/.well-known/jwks.json", async (_, res) => {
	try {
		const request = await axios.get(`http://auth-service:4000/.well-known/jwks.json`);

		res.json(request.data);
	} catch (error) {
		return res.status(500).json(error);
	}
});

export default expressApp;
