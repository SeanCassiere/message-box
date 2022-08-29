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

import { authorizationErrorMiddleware, errorHandlerMiddleware, notFoundMiddleware } from "./middleware/errorMiddleware";

import hiddenRouter from "./routes/hidden.routes";
import authenticationRouter from "./routes/authentication.routes";
import userRouter from "./routes/user.routes";
import clientRouter from "./routes/client.routes";
import roleRouter from "./routes/roles.routes";
import teamRouter from "./routes/teams.routes";
import tasksRouter from "./routes/task.routes";
import calendarEventRouter from "./routes/calendarEvent.routes";
import reportsRouter from "./routes/reports.routes";
import chatsRouter from "./routes/chat.routes";
import dashboardRouter from "./routes/dashboard.routes";

const corsOptions: CorsOptions = {
  origin: (_, cb) => cb(null, true),
  credentials: true,
};

function startServer(port: number) {
  const PORT = port;
  // server setup
  const app = express();
  const httpServer = createServer(app);

  // socket-io setup
  const io = new Server(httpServer, {
    cors: {
      ...corsOptions,
    },
  });

  // express middleware setup
  app.use(cors(corsOptions));
  app.use(morgan("tiny"));
  app.use(helmet());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(express.json());

  app.get("/docs/swagger.json", (_, res) => {
    return res.status(200).send(swaggerDocument);
  });

  app.use("/docs", swaggerUI.serveFiles(undefined, swaggerOptions), swaggerUI.setup(undefined, swaggerOptions));

  app.get("/.well-known/jwks.json", async (_, res) => {
    try {
      const request = await axios.get(`${AUTH_SERVICE_URI}/.well-known/jwks.json`);

      res.json(request.data);
    } catch (error) {
      return res.status(500).json(error);
    }
  });

  app.use(
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

  app.use("/Api/Hidden", hiddenRouter);
  app.use("/Api/Authentication", authenticationRouter);
  app.use("/Api/Users", userRouter);
  app.use("/Api/Clients", clientRouter);
  app.use("/Api/Roles", roleRouter);
  app.use("/Api/Teams", teamRouter);
  app.use("/Api/Tasks", tasksRouter);
  app.use("/Api/CalendarEvent", calendarEventRouter);
  app.use("/Api/Reports", reportsRouter);
  app.use("/Api/Chats", chatsRouter);
  app.use("/Api/Dashboard", dashboardRouter);

  app.use(authorizationErrorMiddleware);
  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  httpServer.listen(PORT, () => {
    log.info(`api-gateway is powered up and listening on port ${PORT} 🚀`);

    socket({ io });
  });
}

export default startServer;
