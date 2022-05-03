import axios from "axios";

import { APP_DATA_SERVICE_URI } from "#root/constants";
import { log } from "./logger";

interface IProps {
  clientId: string;
  userId: string;
  action: string;
  description: string;
}

export async function createActivityLog({ clientId, userId, action, description }: IProps) {
  try {
    await axios.post(`${APP_DATA_SERVICE_URI}/activity/createActivityLog`, {
      variables: {
        clientId,
        userId,
      },
      body: {
        action,
        description,
      },
    });
    return true;
  } catch (error) {
    log.error(`Error adding action from api-gateway (${action}) for user ${userId}`);
    return false;
  }
}
