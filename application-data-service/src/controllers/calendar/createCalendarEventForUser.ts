import { Request, Response } from "express";
import * as yup from "yup";
import axios from "axios";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import CalendarEvent from "#root/db/entities/CalendarEvent";
import CalendarEventShareMapping from "#root/db/entities/CalendarEventShareMappings";
import { formatCalendarEventResponse } from "#root/utils/formatResponses";
import { AUTH_SERVICE_URI } from "#root/utils/constants";
import { calendarEventBodySchema } from "./common";
import { log } from "#root/utils/logger";
import { createDbActivityLog } from "#root/utils/createDbActivityLog";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
  }),
  body: calendarEventBodySchema,
});

export async function createCalendarEventForUser(req: Request, res: Response) {
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

  let savedEvent: CalendarEvent | null = null;

  try {
    // save the task
    const calendarEvent = await CalendarEvent.create({
      clientId: variables.clientId,
      ownerId: body.ownerId,
      title: body.title,
      description: body.description,
      startDate: body.startDate,
      endDate: body.endDate,
    }).save();

    savedEvent = calendarEvent;
  } catch (error) {
    log.error(`createCalendarEventForUser: Error creating the event`);
  }

  if (!savedEvent) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ field: "service", message: "Something went wrong in POST /calendarEvent" }],
    });
  }

  // add the guests
  const saveableGuests: string[] = [];
  const guestUserIds = body.sharedWith.map((guest: { userId: string }) => guest.userId);
  try {
    let clientUserIds: string[] = [];
    const { data: response } = await axios.post(`${AUTH_SERVICE_URI}/clients/getAllUserIdsForClient`, {
      variables: {
        clientId: variables.clientId,
      },
    });

    clientUserIds = response.data;

    for (const id of guestUserIds) {
      if (clientUserIds.includes(id)) {
        saveableGuests.push(id);
      }
    }
  } catch (error) {
    log.error(
      `POST /clients/createCalendarEventForUser -> ${AUTH_SERVICE_URI}/clients/getAllUserIdsForClient\ncould not fetch the user ids for this client\n${error}`
    );
  }

  const savedGuestsToReturn: { userId: string; name: string }[] = [];
  for (const guestId of saveableGuests) {
    //
    try {
      const savedGuestRecord = await CalendarEventShareMapping.create({
        eventId: savedEvent.eventId,
        userId: guestId,
        startDate: savedEvent.startDate,
        endDate: savedEvent.endDate,
      }).save();

      if (savedGuestRecord) {
        savedGuestsToReturn.push({ userId: savedGuestRecord.userId, name: "" });
      }
    } catch (error) {
      log.error(`createCalendarEventForUser: Error creating the guest record for ${guestId}`);
    }
    //
  }

  createDbActivityLog({
    clientId: variables.clientId,
    userId: variables.userId,
    action: "calendar-event-created",
    description: `Created a calendar event:${savedEvent.eventId}`,
  }).then(() => {
    log.info(`Activity log created for userId: ${variables?.userId}`);
  });

  const formattedResponse = formatCalendarEventResponse({ event: savedEvent, guestUsers: savedGuestsToReturn });
  return res.json({
    statusCode: 200,
    data: formattedResponse,
    errors: [],
    pagination: null,
  });
}
