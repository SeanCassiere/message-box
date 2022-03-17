import express, { NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import swaggerUI, { SwaggerUiOptions } from "swagger-ui-express";
import morgan from "morgan";
import axios from "axios";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";

import { ALLOWED_PUBLIC_PATHS, AUTH_SERVICE_URI } from "./constants";
import swaggerDocument from "./swagger.json";

import authenticationRouter from "./routes/authentication.routes";
import userRouter from "./routes/user.routes";
import clientRouter from "./routes/client.routes";
import roleRouter from "./routes/roles.routes";
import teamRouter from "./routes/teams.routes";
import tasksRouter from "./routes/task.routes";
import hiddenRouter from "./routes/hidden.routes";
import calendarEventRouter from "./routes/calendarEvent.routes";

const expressApp = express();

expressApp.use(cors({ origin: (_, cb) => cb(null, true), credentials: true }));
expressApp.use(morgan("tiny"));
expressApp.use(helmet());
expressApp.use(cookieParser(process.env.COOKIE_SECRET));
expressApp.use(express.json());

expressApp.get("/docs/swagger.json", (_, res) => {
  return res.status(200).send(swaggerDocument);
});

const swaggerOptions: SwaggerUiOptions = {
  swaggerOptions: {
    url: `/docs/swagger.json`,
  },
  customSiteTitle: "MessageBox API Gateway",
  customCss: `
  .swagger-ui .topbar .topbar-wrapper img[alt="Swagger UI"] { visibility: hidden }
  .swagger-ui .topbar .topbar-wrapper .link::after { 
    content: 'MessageBox';
    color: #fff;
    visibility: visible;
    display: block;
    position: absolute;
    padding: 0px;
  }
  .swagger-ui .info .title small.version-stamp {
    background-color: #0d9488;
  }
  `,
};
expressApp.use("/docs", swaggerUI.serveFiles(undefined, swaggerOptions), swaggerUI.setup(undefined, swaggerOptions));

expressApp.get("/.well-known/jwks.json", async (_, res) => {
  try {
    const request = await axios.get(`http://auth-service:4000/.well-known/jwks.json`);

    res.json(request.data);
  } catch (error) {
    return res.status(500).json(error);
  }
});

expressApp.use(
  jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      cacheMaxAge: 3600,
      rateLimit: true,
      jwksUri: `${AUTH_SERVICE_URI}/.well-known/jwks.json`,
    }),
    algorithms: ["RS256"],
    requestProperty: "auth",
  }).unless({ path: [...ALLOWED_PUBLIC_PATHS] })
);

/**
 * @description used to trigger actions in a microservice
 */
expressApp.use("/Api/Hidden", hiddenRouter);

/**
 * @description public application routes
 */
expressApp.use("/Api/Authentication", authenticationRouter);
expressApp.use("/Api/Users", userRouter);
expressApp.use("/Api/Clients", clientRouter);
expressApp.use("/Api/Roles", roleRouter);
expressApp.use("/Api/Teams", teamRouter);
expressApp.use("/Api/Tasks", tasksRouter);
expressApp.use("/Api/CalendarEvent", calendarEventRouter);

expressApp.use(function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: "Invalid access token" });
  }
});

export default expressApp;
