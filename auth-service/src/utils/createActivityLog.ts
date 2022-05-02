import axios from "axios";

import { log } from "./logger";
import { APP_DATA_SERVICE_URI } from "./constants";

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
    log.error(`Error adding action from auth-service (${action}) for user ${userId}`);
    return false;
  }
}
