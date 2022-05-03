import { Request, Response } from "express";
import * as yup from "yup";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import CalendarEvent from "#root/db/entities/CalendarEvent";
import CalendarEventShareMapping from "#root/db/entities/CalendarEventShareMappings";
import { log } from "#root/utils/logger";
import { createDbActivityLog } from "#root/utils/createDbActivityLog";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
  }),
  body: yup.object().shape({
    eventId: yup.string().required("EventID is required"),
  }),
});

export async function deleteCalendarEventById(req: Request, res: Response) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      pagination: null,
      errors: checkErrors,
    });
  }

  const variables = req.body.variables;
  const body = req.body.body;

  try {
    const event = await CalendarEvent.findOne({ where: { eventId: body.eventId } });

    if (!event) {
      return res.json({
        statusCode: 500,
        data: null,
        errors: [{ field: "eventId", message: "Event does not exist" }],
      });
    }
    await event.remove();

    const eventGuestMappings = await CalendarEventShareMapping.find({ where: { eventId: body.eventId } });
    const promisesToExecute = [];
    for (const mapping of eventGuestMappings) {
      promisesToExecute.push(mapping.remove());
    }

    await Promise.all(promisesToExecute);
  } catch (error) {
    log.error(`Something went wrong in POST /calendarEvents /deleteCalendarEventById`);
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ field: "eventId", message: "Something went wrong in POST /calendarEvents /deleteCalendarEventById" }],
    });
  }

  createDbActivityLog({
    clientId: variables.clientId,
    userId: variables.userId,
    action: "calendar-event-deleted",
    description: `Deleted a calendar event:${body.eventId}`,
  }).then(() => {
    log.info(`Activity log created for userId: ${variables?.userId}`);
  });
  return res.json({
    statusCode: 200,
    data: {
      success: true,
    },
    errors: [],
    pagination: null,
  });
}
