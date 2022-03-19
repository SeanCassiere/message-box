import dotenv from "dotenv-safe";
import { Connection, createConnection } from "typeorm";

import { log } from "#root/utils/logger";

import User from "./entities/User";
import Client from "./entities/Client";
import Role from "./entities/Role";
import RoleMapping from "./entities/RoleMapping";
import TwoFactorAuthMapping from "./entities/TwoFactorAuthMapping";
import EmailConfirmations from "./entities/EmailConfirmations";
import Team from "./entities/Team";
import TeamMapping from "./entities/TeamMapping";
import Token from "./entities/Token";

dotenv.config();

let connection: Connection;

export async function initConnection(retries = 5) {
  let isError = true;
  while (retries) {
    try {
      connection = await createConnection({
        entities: [User, Client, Role, RoleMapping, TwoFactorAuthMapping, EmailConfirmations, Team, TeamMapping, Token],
        type: "postgres",
        url: process.env.AUTH_SERVICE_DB_URL,
        synchronize: true,
      });
      isError = false;
      return connection;
    } catch (err) {
      log.error(`auth-service db failed: ${err}`);
      retries--;
      log.error(`retries remaining: ${retries}`);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  if (isError) throw new Error("auth-service db connection failed");
  return;
}

const getConnection = () => connection;

export default getConnection;
