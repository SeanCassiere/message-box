import { createServer } from "http";

import expressApp from "./server";

const httpServer = createServer(expressApp);

httpServer.listen(5000, () => {
	console.log("🚀🚀 api-gateway is powered up");
});
