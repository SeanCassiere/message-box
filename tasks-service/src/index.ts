import "reflect-metadata";
import { createServer } from "http";
import { initConnection } from "#root/db/connection";
import expressApp from "./server";

const httpServer = createServer(expressApp);

initConnection()
	.then(() => {
		httpServer.listen(4000, () => {
			console.log("tasks-service is up and running 🚀");
		});
	})
	.catch((err) => {
		console.error(`tasks-service had a fatal death\n\n${err}\n\n`);
		process.exit(1);
	});
