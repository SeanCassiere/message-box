import { Request, Response } from "express";
import * as yup from "yup";
import axios from "axios";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import CalendarEvent from "#root/db/entities/CalendarEvent";
import CalendarEventShareMapping from "#root/db/entities/CalendarEventShareMappings";
import { formatCalendarEventResponse, IFormatCalendarEventResponse } from "#root/utils/formatResponses";
import { AUTH_SERVICE_URI } from "#root/utils/constants";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
  }),
  body: yup.object().shape({
    eventId: yup.string().required("EventID is required"),
  }),
});

export async function getCalendarEventById(req: Request, res: Response) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      pagination: null,
      errors: checkErrors,
    });
  }

  // const variables = req.body.variables;
  const body = req.body.body;

  let foundEvent: CalendarEvent | null = null;
  let idsToFind: string[] = [];
  try {
    const event = await CalendarEvent.findOne({ where: { eventId: body.eventId } });

    foundEvent = event ?? null;

    const mappings = await CalendarEventShareMapping.find({ where: { eventId: body.eventId } });
    idsToFind = mappings.map((mapping) => mapping.userId);
  } catch (error) {
    console.log();
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ field: "eventId", message: "Something went wrong in POST /calendarEvents /getCalendarEventById" }],
    });
  }

  if (!foundEvent) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: [{ field: "eventId", message: "Event does not exist" }],
    });
  }

  let usersToReturn: { userId: string; name: string }[] = [];

  // if ids are there, get details for all users in list
  if (idsToFind.length > 0) {
    try {
      const { data: response } = await axios.post(`${AUTH_SERVICE_URI}/users/getBasicUsersForIdsArray`, {
        body: {
          idList: [...idsToFind],
        },
      });

      usersToReturn =
        response?.data?.map((u: any) => ({ userId: u.userId, name: `${u.firstName} ${u.lastName}` })) ?? [];
    } catch (error) {
      console.log("could not fetch users details for the ids array");
    }
  }

  const formattedResponse = formatCalendarEventResponse({ event: foundEvent, guestUsers: usersToReturn });

  return res.json({
    statusCode: 200,
    data: formattedResponse,
    errors: [],
    pagination: null,
  });
}
