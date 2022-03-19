import "reflect-metadata";
import { createServer } from "http";
import { initConnection } from "#root/db/connection";
import expressApp from "./server";
import { log } from "./utils/logger";

const httpServer = createServer(expressApp);

initConnection()
  .then(() => {
    httpServer.listen(4000, () => {
      log.info(`auth-service is powered up and listening on port ${4000} 🚀`);
    });
  })
  .catch((err) => {
    log.error(`application-data-service has an error and couldn't start up`);
    process.exit(1);
  });
