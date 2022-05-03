import { Request, Response } from "express";
import * as yup from "yup";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import CalendarEvent from "#root/db/entities/CalendarEvent";
import CalendarEventShareMapping from "#root/db/entities/CalendarEventShareMappings";
import { calendarEventBodySchema } from "./common";
import { returnStringsNotInOriginalArray } from "#root/utils/minorUtils";
import { formatCalendarEventResponse, ICalendarEventGuest } from "#root/utils/formatResponses";
import { AUTH_SERVICE_URI } from "#root/utils/constants";
import axios from "axios";
import { log } from "#root/utils/logger";
import { createDbActivityLog } from "#root/utils/createDbActivityLog";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
    eventId: yup.string().required("EventID is required"),
  }),
  body: calendarEventBodySchema,
});

export async function fullUpdateCalendarEventById(req: Request, res: Response) {
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
    const event = await CalendarEvent.findOne({ where: { eventId: body.eventId } });

    foundCalendarEvent = event ?? null;
  } catch (error) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [
        { field: "eventId", message: "Something went wrong in PUT /calendarEvents /fullUpdateCalendarEventById" },
      ],
    });
  }

  if (!foundCalendarEvent) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: [{ field: "eventId", message: "Event does not exist" }],
    });
  }

  const savePromises = [];
  let shouldDeepUpdate = false;

  // update the basic details
  foundCalendarEvent.title = body.title ?? foundCalendarEvent.title;
  foundCalendarEvent.description = body.description ?? foundCalendarEvent.description;
  foundCalendarEvent.ownerId = body.ownerId ?? foundCalendarEvent.ownerId;

  let updateStartDate = foundCalendarEvent.startDate;
  let updateEndDate = foundCalendarEvent.endDate;

  // compare and update the dates
  if (
    foundCalendarEvent.startDate !== new Date(body.startDate) ||
    foundCalendarEvent.startDate !== new Date(body.endDate)
  ) {
    foundCalendarEvent.startDate = new Date(body.startDate);
    foundCalendarEvent.endDate = new Date(body.endDate);
    //
    updateStartDate = new Date(body.startDate);
    updateEndDate = new Date(body.endDate);
    //
    shouldDeepUpdate = true;
  }

  savePromises.push(foundCalendarEvent.save());

  // update the guests mapped to the event
  try {
    const eventMappings = await CalendarEventShareMapping.find({ where: { eventId: foundCalendarEvent.eventId } });

    const eventMappingUserIds = eventMappings.map((mapping) => mapping.userId);

    // remove the mappings that are not in the new list
    const mappingUserIdsToRemove = returnStringsNotInOriginalArray(
      body.sharedWith.map((sw: ICalendarEventGuest) => sw.userId),
      eventMappingUserIds
    );
    if (mappingUserIdsToRemove.length > 0) {
      shouldDeepUpdate = true;
      for (const removeMappingUserId of mappingUserIdsToRemove) {
        if (eventMappingUserIds.includes(removeMappingUserId)) {
          const eventShare = await CalendarEventShareMapping.findOne({
            where: { userId: removeMappingUserId, eventId: foundCalendarEvent.eventId },
          });
          if (eventShare) {
            savePromises.push(eventShare.remove());
          }
        }
      }
    }

    // add the new mappings that are not in the existing list
    const mappingsUserIdsToAdd = returnStringsNotInOriginalArray(
      eventMappingUserIds,
      body.sharedWith.map((sw: ICalendarEventGuest) => sw.userId)
    );
    if (mappingsUserIdsToAdd.length > 0) {
      shouldDeepUpdate = true;
      for (const addMappingUserId of mappingsUserIdsToAdd) {
        if (!eventMappingUserIds.includes(addMappingUserId)) {
          const newMapping = CalendarEventShareMapping.create({
            eventId: foundCalendarEvent.eventId,
            userId: addMappingUserId,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
          });
          savePromises.push(newMapping.save());
        }
      }
    }

    await Promise.all(savePromises);
  } catch (error) {
    log.error(`updating user mappings for a calendar event\n${error}`);
    return res.json({
      statusCode: 400,
      data: null,
      errors: [{ field: "sharedWith", message: "Problem updating the guest users" }],
    });
  }

  // changing the dates of the event share mappings that are not the same as the parent event
  if (shouldDeepUpdate) {
    try {
      const saveChangeMappingsPromises = [];

      const eventMappingQuery = CalendarEventShareMapping.createQueryBuilder().where("event_id = :eventId", {
        eventId: foundCalendarEvent.eventId,
      });
      const eventMappings = await eventMappingQuery.getMany();

      const eventMappingsToUpdate = eventMappings.filter(
        (mapping) => mapping.startDate !== updateStartDate || mapping.endDate !== updateEndDate
      );

      for (const mapping of eventMappingsToUpdate) {
        mapping.startDate = updateStartDate;
        mapping.endDate = updateEndDate;
        saveChangeMappingsPromises.push(mapping.save());
      }

      await Promise.all(saveChangeMappingsPromises);
    } catch (error) {
      return res.json({
        statusCode: 400,
        data: null,
        errors: [
          { field: "startDate", message: "Problem updating for guests" },
          { field: "endDate", message: "Problem updating for guests" },
        ],
      });
    }
  }

  // reloaded guest users
  let usersToReturn = [];
  try {
    const eventMappings = await CalendarEventShareMapping.find({ where: { eventId: foundCalendarEvent.eventId } });
    const userIdsToFind = eventMappings.map((mapping) => mapping.userId);

    if (userIdsToFind.length > 0) {
      const { data: response } = await axios.post(`${AUTH_SERVICE_URI}/users/getBasicUsersForIdsArray`, {
        body: {
          idList: [...userIdsToFind],
        },
      });

      usersToReturn =
        response?.data?.map((u: any) => ({ userId: u.userId, name: `${u.firstName} ${u.lastName}` })) ?? [];
    }
  } catch (error) {
    log.error("could not fetch users details for the ids array");
  }

  createDbActivityLog({
    clientId: variables.clientId,
    userId: variables.userId,
    action: "calendar-event-updated",
    description: `Updated a calendar event: ${foundCalendarEvent.eventId}`,
  }).then(() => {
    log.info(`Activity log created for userId: ${variables?.userId}`);
  });

  const formattedResponse = formatCalendarEventResponse({ event: foundCalendarEvent, guestUsers: usersToReturn });

  return res.json({
    statusCode: 200,
    data: formattedResponse,
    errors: [],
    pagination: null,
  });
}
