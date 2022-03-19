import { Request, Response } from "express";
import * as yup from "yup";
import axios from "axios";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import CalendarEvent from "#root/db/entities/CalendarEvent";
import CalendarEventShareMapping from "#root/db/entities/CalendarEventShareMappings";
import { formatCalendarEventResponse, IFormatCalendarEventResponse } from "#root/utils/formatResponses";
import { AUTH_SERVICE_URI } from "#root/utils/constants";
import { log } from "#root/utils/logger";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
    ownerId: yup.string().required("OwnerId is required"),
  }),
  body: yup.object().shape({
    startDate: yup.date().required("startDate is required"),
    endDate: yup
      .date()
      .test({
        name: "endDate",
        message: "endDate cannot be before the start date",
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
      .required("endDate is required"),
  }),
});

export async function getCalendarEventsForUser(req: Request, res: Response) {
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

  // get all the user ids for the client
  let clientUserIds: string[] = [];
  try {
    const { data: response } = await axios.post(`${AUTH_SERVICE_URI}/clients/getAllUserIdsForClient`, {
      variables: {
        clientId: variables.clientId,
      },
    });

    clientUserIds = Array.from(response.data);
  } catch (error) {
    console.error(
      `POST /clients/createCalendarEventForUser -> ${AUTH_SERVICE_URI}/clients/getAllUserIdsForClient\ncould not fetch the user ids for this client`
    );
  }

  const events: IFormatCalendarEventResponse[] = [];
  // fetching the direct events
  try {
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    const findEvents = await CalendarEvent.createQueryBuilder()
      .where("owner_id = :ownerId", { ownerId: variables.ownerId })
      .andWhere("start_date >= :startDate", { startDate: startDate })
      .andWhere("end_date <= :endDate", { endDate: endDate })
      .getMany();

    for (const gottenEvent of findEvents) {
      const invitedGuestsToReturn = [];
      const guestEventMappings = await CalendarEventShareMapping.find({ where: { eventId: gottenEvent.eventId } });
      const idOnly = guestEventMappings.map((m) => m.userId);

      for (const id of idOnly) {
        if (clientUserIds.includes(id)) {
          invitedGuestsToReturn.push({ userId: id, name: "" });
        }
      }

      events.push({ event: gottenEvent, guestUsers: invitedGuestsToReturn });
    }
  } catch (error) {
    log.error(`there was an error getting the events\n${error}`);
  }

  // events where user is a guest
  try {
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    const myGuestEvents = await CalendarEventShareMapping.createQueryBuilder()
      .where("user_id = :userId", { userId: variables.ownerId })
      .andWhere("start_date >= :startDate", { startDate: startDate })
      .andWhere("end_date <= :endDate", { endDate: endDate })
      .getMany();

    for (const myGuestEvent of myGuestEvents) {
      const event = await CalendarEvent.findOne({ where: { eventId: myGuestEvent.eventId } });

      if (event) {
        const invitedGuestsToReturn = [];
        const guestEventMappings = await CalendarEventShareMapping.find({ where: { eventId: event.eventId } });
        const idOnly = guestEventMappings.map((m) => m.userId);

        for (const id of idOnly) {
          if (Array.from(clientUserIds).includes(id)) {
            invitedGuestsToReturn.push({ userId: id, name: "" });
          }
        }

        events.push({ event: event, guestUsers: invitedGuestsToReturn });
      }
    }
  } catch (error) {
    log.error(`there was an error getting the guest events\n${error}`);
  }

  const formattedResponse = events.map((e) => formatCalendarEventResponse(e));
  return res.json({
    statusCode: 200,
    data: formattedResponse,
    errors: [],
    pagination: null,
  });
}
