import express from "express";
import cors from "cors";
import morgan from "morgan";

import { getAllTasksForUser } from "./controllers/tasks/getAllTasksForUser";
import { createTaskForUser } from "./controllers/tasks/createTaskForUser";
import { getTaskById } from "./controllers/tasks/getTaskById";
import { deleteTaskById } from "./controllers/tasks/deleteTaskById";
import { updateTaskById } from "./controllers/tasks/updateTaskById";

import { createCalendarEventForUser } from "./controllers/calendar/createCalendarEventForUser";
import { getCalendarEventsForUser } from "./controllers/calendar/getCalendarEventsForUser";

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

export default expressApp;
