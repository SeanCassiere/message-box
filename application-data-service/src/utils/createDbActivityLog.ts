import ActivityLog from "#root/db/entities/ActivityLog";
import { log } from "./logger";

interface IProps {
  clientId: string;
  userId: string;
  action: string;
  description: string;
}
export async function createDbActivityLog({ clientId, userId, action, description }: IProps) {
  try {
    await ActivityLog.create({ action: action, description: description, clientId: clientId, userId: userId }).save();
    return true;
  } catch (error) {
    log.error(`Error adding action (${action}) for user ${userId}`);
    return false;
  }
}
