import React, { useState, useCallback, useEffect, useMemo, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import useMediaQuery from "@mui/material/useMediaQuery";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete";

import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import EventIcon from "@mui/icons-material/Event";

import EventFormDialog from "./EventFormDialog";
import CalendarSchedular from "./SchedularWidget";
import PagePaperWrapper from "../../shared/components/Layout/PagePaperWrapper";
import DeleteEventConfirmationDialog from "./DeleteEventConfirmationDialog";
import TextField from "../../shared/components/Form/TextField";

import { ICalendarEventComponentDevExpress } from "../../shared/interfaces/CalendarEvent.interfaces";
import { selectLookupListsState, selectUserState } from "../../shared/redux/store";
import { getDateRangeFromViewName } from "../../shared/components/Calendar/common";
import { client } from "../../shared/api/client";
import { MESSAGES } from "../../shared/util/messages";
import { remapCalendarEventsForApplication } from "../../shared/util/responseRemap";
import { usePermission } from "../../shared/hooks/usePermission";

const CalendarScreen = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { id } = useParams<{ id: string }>();
  const { userProfile } = useSelector(selectUserState);
  const { usersList } = useSelector(selectLookupListsState);

  const isCalendarAdmin = usePermission("calendar:admin");

  const [currentViewingUserId, setCurrentViewingUserId] = useState<string>(userProfile?.userId ?? "");

  const [eventEditId, setEventEditId] = useState<string | "new">("new");
  const [showEditOverlay, setShowEditOverlay] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDeleteId, setOpenDeleteId] = useState<string | null>(null);

  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [fetchedCalendarEvents, setFetchedCalendarEvents] = useState<ICalendarEventComponentDevExpress[]>([]);

  /**
   * API CALL
   */
  const fetchCalendarEvents = useCallback(
    async (date: Date, viewName: string, abort?: AbortController) => {
      const signal = abort ? abort.signal : undefined;

      setIsCalendarLoading(true);
      const [startDate, endDate] = getDateRangeFromViewName(viewName, date);

      let urlParams: Object = { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
      if (userProfile?.userId !== currentViewingUserId) {
        urlParams = { ...urlParams, ownerId: currentViewingUserId };
      }

      client
        .get("/CalendarEvent", {
          params: urlParams,
          signal: signal,
        })
        .then((response) => {
          if (response.status !== 200) {
            enqueueSnackbar(`Error fetching calendar events`, { variant: "error" });
            return;
          }

          setFetchedCalendarEvents(remapCalendarEventsForApplication(response.data));
        })
        .catch((e) => {
          if (e.message !== "canceled") {
            console.log(`Error fetching calendar events`);
            enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
          }
        })
        .finally(() => {
          setIsCalendarLoading(false);
        });
    },
    [enqueueSnackbar, userProfile, currentViewingUserId]
  );

  const [calendarViewName, setCalendarViewName] = useState("Week");
  const [calendarDate, setCalendarDate] = useState(new Date(new Date().setHours(0, 0, 0, 0)));

  const triggerRefresh = useCallback(() => {
    fetchCalendarEvents(calendarDate, calendarViewName);
  }, [calendarDate, calendarViewName, fetchCalendarEvents]);

  const handleSetCalendarDate = useCallback(
    (date: Date, viewName: string) => {
      setCalendarDate(date);
      fetchCalendarEvents(date, viewName);
    },
    [fetchCalendarEvents]
  );

  const handleChangeViewName = useCallback(
    (viewName: string) => {
      const setDate = new Date();
      setCalendarDate(setDate);
      setCalendarViewName(viewName);
      fetchCalendarEvents(setDate, viewName);
    },
    [fetchCalendarEvents]
  );

  //
  useEffect(() => {
    const abort = new AbortController();
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    fetchCalendarEvents(currentDate, "Week", abort);

    return () => {
      abort.abort();
    };
  }, [fetchCalendarEvents]);

  useEffect(() => {
    if (id) {
      setEventEditId(id.toLowerCase());
      setShowEditOverlay(true);
    }
  }, [id]);

  const handleAcceptDelete = useCallback(() => {
    fetchCalendarEvents(calendarDate, calendarViewName);
    setOpenDeleteDialog(false);
    setOpenDeleteId(null);
  }, [calendarDate, calendarViewName, fetchCalendarEvents]);

  const handleOpenDeleteDialog = useCallback((id: string | null) => {
    setOpenDeleteId(id);
    setOpenDeleteDialog(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setOpenDeleteDialog(false);
    setOpenDeleteId(null);
  }, []);

  const handleShowNewDialog = useCallback(() => {
    navigate("new");
  }, [navigate]);

  const handleHideDialog = useCallback(() => {
    setShowEditOverlay(false);
    navigate("/calendar");
    setEventEditId("new");
  }, [navigate]);

  const userSelectOptions = useMemo(() => {
    return usersList.map((user) => ({
      id: user.userId,
      label: `${user.firstName} ${user.lastName}`,
    }));
  }, [usersList]);

  const selectedUserValue = useMemo(() => {
    if (currentViewingUserId === "") return undefined;

    const user = usersList.find((u) => u.userId === currentViewingUserId);

    if (!user) {
      return { label: `${userProfile?.firstName} ${userProfile?.lastName}`, id: userProfile?.userId ?? "" };
    }

    return { label: `${user.firstName} ${user.lastName}`, id: user.userId };
  }, [currentViewingUserId, userProfile?.firstName, userProfile?.lastName, userProfile?.userId, usersList]);

  const handleSelectCurrentUserId = useCallback(
    (
      evt: any,
      value:
        | string
        | {
            id: string;
            label: string;
          }
        | null
    ) => {
      if (!value) return;

      if (typeof value === "string") {
        const split = value.split(" ");
        const user = usersList.find((u) => u.firstName === split[0] && u.lastName === split[1]);

        if (!user) {
          return;
        }

        setCurrentViewingUserId(user.userId);
      }

      if (typeof value === "object") {
        setCurrentViewingUserId(value.id);
      }
    },
    [usersList]
  );

  const handleEditPatchAppointment = useCallback(
    ({ id, startDate, endDate }: { id: string; startDate: string; endDate: string }) => {
      const withoutEventList = fetchedCalendarEvents.filter((e) => e.id !== id);
      const findEvent = fetchedCalendarEvents.find((e) => e.id === id);

      if (findEvent) {
        const newEvent = { ...findEvent, startDate: startDate, endDate: endDate };
        withoutEventList.push(newEvent);
        setFetchedCalendarEvents(withoutEventList);
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
            fetchCalendarEvents(calendarDate, calendarViewName);
          });
      }
    },
    [calendarDate, calendarViewName, enqueueSnackbar, fetchCalendarEvents, fetchedCalendarEvents]
  );

  const eventsForSchedular = useMemo(() => {
    return fetchedCalendarEvents;
  }, [fetchedCalendarEvents]);

  const eventsAreLoading = useMemo(() => {
    return isCalendarLoading;
  }, [isCalendarLoading]);

  return (
    <>
      <EventFormDialog
        eventId={eventEditId}
        ownerId={userProfile?.userId ?? ""}
        showDialog={showEditOverlay}
        handleClose={handleHideDialog}
        handleRefreshList={triggerRefresh}
      />
      <DeleteEventConfirmationDialog
        showDialog={openDeleteDialog}
        handleAccept={handleAcceptDelete}
        handleClose={handleCloseDeleteDialog}
        deleteId={openDeleteId}
      />
      <PagePaperWrapper>
        <Grid container sx={{ marginBottom: 2 }}>
          <Grid item xs={12} md={7} sx={{ mb: 1 }}>
            <Typography variant="h4" fontWeight={500} component="h1">
              Calendar
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack
              gap={2}
              flexDirection={{ sm: "column", md: "row" }}
              justifyContent={{ sx: "start", md: "end" }}
              alignItems={{ sm: "start", md: "center" }}
            >
              <IconButton
                sx={{ mr: 1 }}
                aria-label="refresh"
                onClick={() => fetchCalendarEvents(calendarDate, calendarViewName)}
              >
                <RefreshOutlinedIcon />
              </IconButton>
              {isCalendarAdmin && (
                <Autocomplete
                  id="user-calendar-view-options"
                  options={userSelectOptions}
                  value={selectedUserValue}
                  freeSolo
                  autoSelect
                  openOnFocus
                  onChange={handleSelectCurrentUserId}
                  sx={{ width: 250 }}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      // size="small"
                      InputProps={{ ...params.InputProps, endAdornment: <></> }}
                      fullWidth
                    />
                  )}
                />
              )}
              <Button
                aria-label="New Event"
                startIcon={<EventIcon />}
                onClick={handleShowNewDialog}
                disableElevation={false}
              >
                New Event
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <CalendarSchedular
          calendarViewingDate={calendarDate}
          setCalendarViewName={handleChangeViewName}
          setCalendarViewingDate={handleSetCalendarDate}
          handlePatchAppointment={handleEditPatchAppointment}
          viewName={calendarViewName}
          calendarEvents={eventsForSchedular}
          isCalendarLoading={eventsAreLoading}
          openDeleteOverlay={handleOpenDeleteDialog}
          maxHeight={isOnMobile ? 600 : 752}
        />
      </PagePaperWrapper>
    </>
  );
};

export default memo(CalendarScreen);
