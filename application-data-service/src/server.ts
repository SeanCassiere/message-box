import express from "express";
import cors from "cors";
import morgan from "morgan";

import { getAllTasksForUser } from "./controllers/tasks/getAllTasksForUser";
import { createTaskForUser } from "./controllers/tasks/createTaskForUser";
import { getTaskById } from "./controllers/tasks/getTaskById";
import { deleteTaskById } from "./controllers/tasks/deleteTaskById";
import { updateTaskById } from "./controllers/tasks/updateTaskById";

import { createActivityLog } from "./controllers/activity/createActivityLog";

import { createCalendarEventForUser } from "./controllers/calendar/createCalendarEventForUser";
import { getCalendarEventsForUser } from "./controllers/calendar/getCalendarEventsForUser";
import { deleteCalendarEventById } from "./controllers/calendar/deleteCalendarEventById";
import { getCalendarEventById } from "./controllers/calendar/getCalendarEventById";
import { fullUpdateCalendarEventById } from "./controllers/calendar/fullUpdateCalendarEventById";
import { patchCalendarEventDetailsById } from "./controllers/calendar/patchCalendarEventDetailsById";

import { getReportsForClient } from "./controllers/reports/getReportsForClient";
import { runReportForClient } from "./controllers/reports/runReportForClient";

import { createChatRoomForUser } from "./controllers/chat/createChatRoomForUser";
import { getSingleChatRoomForUser } from "./controllers/chat/getSingleChatRoomForUser";
import { getAllChatRoomsForUser } from "./controllers/chat/getAllChatRoomsForUser";
import { deleteChatRoomForRoomId } from "./controllers/chat/deleteChatRoomForRoomId";
import { updateChatRoomForRoomId } from "./controllers/chat/updateChatRoomForRoomId";
import { getMessagesForRoomById } from "./controllers/chat/getMessagesForRoomById";
import { createMessageForChatRoom } from "./controllers/chat/createMessageForChatRoom";

import { getWidgetsForUser } from "./controllers/dashboard/getWidgetsForUser";
import { deleteWidgetById } from "./controllers/dashboard/deleteWidgetById";
import { createWidgetForUser } from "./controllers/dashboard/createWidgetForUser";
import { patchWidgetPositions } from "./controllers/dashboard/patchWidgetPositions";

const expressApp = express();

expressApp.use(cors({ origin: (_, cb) => cb(null, true), credentials: true }));
expressApp.use(express.json());
expressApp.use(morgan("dev"));

/**
 * All tasks related routes
 */
expressApp.post("/tasks/getAllTasksForUser", getAllTasksForUser);
expressApp.post("/tasks/createTaskForUser", createTaskForUser);
expressApp.post("/tasks/getTaskById", getTaskById);
expressApp.post("/tasks/deleteTaskById", deleteTaskById);
expressApp.post("/tasks/updateTaskById", updateTaskById);

/**
 * All calendar-event related routes
 */
expressApp.post("/calendar-events/createCalendarEventForUser", createCalendarEventForUser);
expressApp.post("/calendar-events/getCalendarEventsForUser", getCalendarEventsForUser);
expressApp.post("/calendar-events/deleteCalendarEventById", deleteCalendarEventById);
expressApp.post("/calendar-events/getCalendarEventById", getCalendarEventById);
expressApp.post("/calendar-events/fullUpdateCalendarEventById", fullUpdateCalendarEventById);
expressApp.post("/calendar-events/patchCalendarEventDetailsById", patchCalendarEventDetailsById);

/**
 * All reports related routes
 */
expressApp.post("/reports/getReportsForClient", getReportsForClient);
expressApp.post("/reports/runReportForClient", runReportForClient);

/**
 * All chat related routes
 */
expressApp.post("/chat/createChatRoomForUser", createChatRoomForUser);
expressApp.post("/chat/getSingleChatRoomForUser", getSingleChatRoomForUser);
expressApp.post("/chat/getAllChatRoomsForUser", getAllChatRoomsForUser);
expressApp.post("/chat/deleteChatRoomForRoomId", deleteChatRoomForRoomId);
expressApp.post("/chat/updateChatRoomForRoomId", updateChatRoomForRoomId);
expressApp.post("/chat/getMessagesForRoomById", getMessagesForRoomById);
expressApp.post("/chat/createMessageForChatRoom", createMessageForChatRoom);

expressApp.post("/activity/createActivityLog", createActivityLog);

/**
 * All dashboard related routes
 */
expressApp.post("/dashboard/getWidgetsForUser", getWidgetsForUser);
expressApp.post("/dashboard/deleteWidgetById", deleteWidgetById);
expressApp.post("/dashboard/createWidgetForUser", createWidgetForUser);
expressApp.post("/dashboard/patchWidgetPositions", patchWidgetPositions);

export default expressApp;
