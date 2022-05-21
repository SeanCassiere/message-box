import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import Box from "@mui/material/Box";

import CalendarSchedularComponent from "../../Calendar/CalendarSchedularComponent";

import { client } from "../../../api/client";
import { IParsedWidgetOnDashboard } from "../../../interfaces/Dashboard.interfaces";
import { ICalendarEventComponentDevExpress } from "../../../interfaces/CalendarEvent.interfaces";
import { stateOpenAddCalendarEventDialog } from "../../../redux/slices/dynamicDialog/dynamicDialogSlice";
import { selectUserState } from "../../../redux/store";
import { getDateRangeFromViewName } from "../../Calendar/common";
import { remapCalendarEventsForApplication } from "../../../util/responseRemap";
import { MESSAGES } from "../../../util/messages";

interface IProps {
  widget: IParsedWidgetOnDashboard;
}

const MyCalendar = (props: IProps) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { userProfile } = useSelector(selectUserState);

  const [loadingEvents, setLoadingEvents] = React.useState(true);
  const [events, setEvents] = React.useState<ICalendarEventComponentDevExpress[]>([]);
  const [viewName, setViewName] = React.useState("Day");

  const [viewingDate, setViewingDate] = React.useState(new Date());
  const handleSetCalendarViewingDate = React.useCallback((date: Date, viewName: string) => {
    setViewingDate(date);
  }, []);

  const fetchEvents = React.useCallback(
    (date: Date, viewName: string, abort?: AbortController) => {
      setLoadingEvents(true);
      let currentViewName = viewName;
      const searchViewParam = props.widget.config.filter((p) => p.parameter === "viewName");
      if (searchViewParam.length > 0) {
        currentViewName = searchViewParam[0].value;
        setViewName(searchViewParam[0].value);
      }

      const [startDate, endDate] = getDateRangeFromViewName(currentViewName, date);

      const params = new URLSearchParams();
      params.append("startDate", startDate.toISOString());
      params.append("endDate", endDate.toISOString());

      const signal = abort ? abort.signal : undefined;
      client
        .get("/CalendarEvent", {
          params: params,
          signal: signal,
        })
        .then((response) => {
          if (response.status !== 200) {
            return;
          }

          setEvents(remapCalendarEventsForApplication(response.data));
        })
        .catch((e) => {
          if (e.message !== "canceled") {
            console.log(`Error fetching calendar events`);
          }
        })
        .finally(() => {
          setLoadingEvents(false);
        });
      setLoadingEvents(false);
    },
    [props.widget.config]
  );

  React.useEffect(() => {
    const abort = new AbortController();
    fetchEvents(viewingDate, viewName, abort);

    return () => {
      abort.abort();
    };
  }, [fetchEvents, viewName, viewingDate]);

  const doubleClickAppointment = React.useCallback(
    (eventId: string) => {
      dispatch(stateOpenAddCalendarEventDialog({ referenceId: eventId, currentUserId: userProfile?.userId ?? "" }));
    },
    [dispatch, userProfile?.userId]
  );

  const patchAppointment = React.useCallback(
    ({ id, startDate, endDate }: { id: string; startDate: string; endDate: string }) => {
      const withoutEventList = events.filter((e) => e.id !== id);
      const findEvent = events.find((e) => e.id === id);

      if (findEvent) {
        const newEvent = { ...findEvent, startDate: startDate, endDate: endDate };
        withoutEventList.push(newEvent);
        setEvents(withoutEventList);
        //
        client
          .patch(`/CalendarEvent/${newEvent.id}`, { startDate: newEvent.startDate, endDate: newEvent.endDate })
          .then((response) => {
            if (response.status !== 200) {
              enqueueSnackbar(`Error updating calendar event`, { variant: "error" });
              return;
            }
          })
          .catch((error) => {
            if (error.message !== "canceled") {
              enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
            }
          })
          .finally(() => {
            fetchEvents(viewingDate, viewName);
          });
      }
    },
    [enqueueSnackbar, events, fetchEvents, viewName, viewingDate]
  );

  return (
    <Box sx={{ mt: -1, ml: -1, height: "100%", width: "100%" }}>
      <CalendarSchedularComponent
        calendarViewingDate={viewingDate}
        setCalendarViewingDate={handleSetCalendarViewingDate}
        viewName={viewName}
        calendarEvents={events}
        isCalendarLoading={loadingEvents}
        handleDoubleClickAppointment={doubleClickAppointment}
        handlePatchAppointment={patchAppointment}
        turnOffViewSwitching
      />
    </Box>
  );
};

export default MyCalendar;
