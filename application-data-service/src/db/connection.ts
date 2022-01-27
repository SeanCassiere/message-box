import dotenv from "dotenv-safe";
import { Connection, createConnection } from "typeorm";

dotenv.config();

let connection: Connection;

export async function initConnection(retries = 5) {
  let isError = true;

  while (retries) {
    try {
      connection = await createConnection({
        entities: [],
        type: "postgres",
        url: process.env.APPLICATION_DATA_SERVICE_DB_URL,
        synchronize: true,
      });
      isError = false;
      return connection;
    } catch (err) {
      console.error(`application-data-service db failed: ${err}`);
      retries--;
      console.log(`retries remaining: ${retries}`);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  if (isError) throw new Error("application-data-service db connection failed");
  return;
}

const getConnection = () => connection;

export default getConnection;
