import dotenv from "dotenv-safe";
import { Connection, createConnection } from "typeorm";

import User from "./entities/User";
import Client from "./entities/Client";
import Role from "./entities/Role";
import RoleMapping from "./entities/RoleMapping";
import TwoFactorAuthMapping from "./entities/TwoFactorAuthMapping";
import EmailConfirmations from "./entities/EmailConfirmations";
import Team from "./entities/Team";
import TeamMapping from "./entities/TeamMapping";

dotenv.config();

let connection: Connection;

export async function initConnection(retries = 5) {
	let isError = true;
	while (retries) {
		try {
			connection = await createConnection({
				entities: [User, Client, Role, RoleMapping, TwoFactorAuthMapping, EmailConfirmations, Team, TeamMapping],
				type: "postgres",
				url: process.env.AUTH_SERVICE_DB_URL,
				synchronize: true,
			});
			isError = false;
			return connection;
		} catch (err) {
			console.error(`auth-service db failed: ${err}`);
			retries--;
			console.log(`retries remaining: ${retries}`);
			await new Promise((res) => setTimeout(res, 5000));
		}
	}
	if (isError) throw new Error("auth-service db connection failed");
	return;
}

const getConnection = () => connection;

export default getConnection;
