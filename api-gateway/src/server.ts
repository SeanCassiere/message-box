import express from "express";
import cors, { CorsOptions } from "cors";
import { createServer } from "http";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import morgan from "morgan";
import axios from "axios";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import { Server } from "socket.io";

import { log } from "./utils/logger";
import { socket } from "./controllers/socketController";
import { ALLOWED_PUBLIC_PATHS, AUTH_SERVICE_URI, swaggerOptions } from "./constants";

import swaggerDocument from "./swagger.json";

import authenticationRouter from "./routes/authentication.routes";
import userRouter from "./routes/user.routes";
import clientRouter from "./routes/client.routes";
import roleRouter from "./routes/roles.routes";
import teamRouter from "./routes/teams.routes";
import tasksRouter from "./routes/task.routes";
import hiddenRouter from "./routes/hidden.routes";
import calendarEventRouter from "./routes/calendarEvent.routes";
import { authorizationErrorMiddleware } from "./middleware/errorMiddleware";

const corsOptions: CorsOptions = {
  origin: (_, cb) => cb(null, true),
  credentials: true,
};

function startServer(port: number) {
  const PORT = port;
  // server setup
  const expressApp = express();
  const httpServer = createServer(expressApp);

  // socket-io setup
  const io = new Server(httpServer, {
    cors: {
      ...corsOptions,
    },
  });

  // express middleware setup
  expressApp.use(cors(corsOptions));
  expressApp.use(morgan("tiny"));
  expressApp.use(helmet());
  expressApp.use(cookieParser(process.env.COOKIE_SECRET));
  expressApp.use(express.json());

  expressApp.get("/docs/swagger.json", (_, res) => {
    return res.status(200).send(swaggerDocument);
  });

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

  expressApp.use("/Api/Hidden", hiddenRouter);

  expressApp.use("/Api/Authentication", authenticationRouter);
  expressApp.use("/Api/Users", userRouter);
  expressApp.use("/Api/Clients", clientRouter);
  expressApp.use("/Api/Roles", roleRouter);
  expressApp.use("/Api/Teams", teamRouter);
  expressApp.use("/Api/Tasks", tasksRouter);
  expressApp.use("/Api/CalendarEvent", calendarEventRouter);

  expressApp.use(authorizationErrorMiddleware);
  httpServer.listen(PORT, () => {
    log.info(`api-gateway is powered up and listening on port ${PORT} 🚀`);

    socket({ io });
  });
}

export default startServer;
