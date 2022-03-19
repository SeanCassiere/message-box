import { Request, Response } from "express";
import * as yup from "yup";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import CalendarEvent from "#root/db/entities/CalendarEvent";
import CalendarEventShareMapping from "#root/db/entities/CalendarEventShareMappings";
import { log } from "#root/utils/logger";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
    eventId: yup.string().required("EventID is required"),
  }),
  body: yup.object().shape({
    startDate: yup.date().required("Start date is required"),
    endDate: yup
      .date()
      .test({
        name: "End date",
        message: "End date cannot be before the start date",
        test: function (value, ctx) {
          if (!value) return true;

          const startDate = new Date(ctx?.parent?.startDate as string);

          if (Number(new Date(value)) <= Number(startDate)) {
            return false;
          } else {
            return true;
          }
        },
      })
      .required("End date is required"),
  }),
});

export async function patchCalendarEventDetailsById(req: Request, res: Response) {
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

  let foundCalendarEvent: CalendarEvent | null = null;

  try {
    const event = await CalendarEvent.findOne({ where: { eventId: variables.eventId } });

    foundCalendarEvent = event ?? null;
  } catch (error) {
    return res.json({
      statusCode: 400,
      data: {
        success: false,
      },
      errors: [{ field: "eventId", message: "Something went wrong in PUT /calendarEvents /patchCalendarEventDetails" }],
    });
  }

  if (!foundCalendarEvent) {
    return res.json({
      statusCode: 400,
      data: {
        success: false,
      },
      errors: [{ field: "eventId", message: "Event does not exist" }],
    });
  }

  const savePromises = [];

  const saveStartDate = new Date(body.startDate);
  const saveEndDate = new Date(body.endDate);

  foundCalendarEvent.startDate = saveStartDate;
  foundCalendarEvent.endDate = saveEndDate;

  savePromises.push(foundCalendarEvent.save());

  // update the guests mapped to the event
  try {
    const eventMappings = await CalendarEventShareMapping.find({ where: { eventId: foundCalendarEvent.eventId } });

    for (const mapping of eventMappings) {
      mapping.startDate = saveStartDate;
      mapping.endDate = saveEndDate;
      savePromises.push(mapping.save());
    }
  } catch (error) {
    log.error(`Error updating user mappings for a calendar event\n${error}`);
    return res.json({
      statusCode: 400,
      data: {
        success: false,
      },
      errors: [{ field: "sharedWith", message: "Problem updating the guest users" }],
    });
  }

  try {
    await Promise.all(savePromises);
  } catch (error) {
    return res.json({
      statusCode: 400,
      data: {
        success: false,
      },
      errors: [{ field: "eventId", message: "Error patching the calendar event" }],
    });
  }

  return res.json({
    statusCode: 200,
    data: {
      success: true,
    },
    errors: [],
    pagination: null,
  });
}
