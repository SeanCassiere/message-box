import "reflect-metadata";
import { createServer } from "http";
import { initConnection } from "#root/db/connection";
import expressApp from "./server";

const httpServer = createServer(expressApp);

initConnection()
  .then(() => {
    httpServer.listen(4000, () => {
      console.log("application-data-service is up and running 🚀");
    });
  })
  .catch((err) => {
    console.error(`application-data-service had a fatal death\n\n${err}\n\n`);
    process.exit(1);
  });
