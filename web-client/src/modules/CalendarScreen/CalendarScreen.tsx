import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import useMediaQuery from "@mui/material/useMediaQuery";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import EventIcon from "@mui/icons-material/Event";

import EventFormDialog from "./EventFormDialog";
import CalendarSchedular from "./SchedularWidget";
import PagePaperWrapper from "../../shared/components/Layout/PagePaperWrapper";
import DeleteEventConfirmationDialog from "./DeleteEventConfirmationDialog";

import { ICalendarEvent } from "../../shared/interfaces/CalendarEvent.interfaces";
import { selectUserState } from "../../shared/redux/store";
import { getDummyCalendarEvents } from "./demoAppointments";
import { dummyPromise } from "../../shared/util/testingUtils";
import { getDateRangeFromViewName } from "../../shared/components/Calendar/common";

const CalendarScreen = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { id } = useParams<{ id: string }>();
  const { userProfile } = useSelector(selectUserState);

  const [eventEditId, setEventEditId] = useState<string | "new">("new");
  const [showEditOverlay, setShowEditOverlay] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDeleteId, setOpenDeleteId] = useState<string | null>(null);

  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [fetchedCalendarEvents, setFetchedCalendarEvents] = useState<ICalendarEvent[]>([]);

  /**
   * API CALL
   */
  const fetchCalendarEvents = useCallback(async (date: Date, viewName: string) => {
    const [startDate, endDate] = getDateRangeFromViewName(viewName, date);
    console.group(`fetchCalendarEvents(${date.toDateString()}, ${viewName})`);
    console.log("viewName", viewName);
    console.log("startDate", `${startDate.toDateString()} ${startDate.toTimeString()}`);
    console.log("endDate", `${endDate.toDateString()} ${endDate.toTimeString()}`);
    console.groupEnd();

    setIsCalendarLoading(true);

    await dummyPromise(1500);

    /** */
    const month = date.getMonth();
    /** */
    setFetchedCalendarEvents(getDummyCalendarEvents(month + 1));
    setIsCalendarLoading(false);
  }, []);

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

  const handleChangeViewName = useCallback((viewName: string) => {
    setCalendarDate(new Date());
    setCalendarViewName(viewName);
  }, []);

  //
  useEffect(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    fetchCalendarEvents(currentDate, calendarViewName);
  }, [calendarViewName, fetchCalendarEvents]);

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
          <Grid item xs={12} md={5} sx={{ mb: 1 }}>
            <Typography variant="h4" fontWeight={500} component="h1">
              Calendar
            </Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <Stack spacing={2} direction="row" justifyContent={{ sx: "start", md: "end" }} alignItems="center">
              <Button aria-label="New Event" startIcon={<EventIcon />} onClick={handleShowNewDialog}>
                New Event
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <CalendarSchedular
          calendarViewingDate={calendarDate}
          setCalendarViewName={handleChangeViewName}
          setCalendarViewingDate={handleSetCalendarDate}
          viewName={calendarViewName}
          calendarEvents={fetchedCalendarEvents}
          isCalendarLoading={isCalendarLoading}
          openDeleteOverlay={handleOpenDeleteDialog}
          maxHeight={isOnMobile ? 600 : 770}
        />
      </PagePaperWrapper>
    </>
  );
};

export default CalendarScreen;
