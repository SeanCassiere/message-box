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

import PagePaperWrapper from "../../shared/components/Layout/PagePaperWrapper";
import EventFormDialog from "./EventFormDialog";
import CalendarSchedular from "./SchedularWidget";

import { selectUserState } from "../../shared/redux/store";
import { ICalendarEvent } from "../../shared/interfaces/CalendarEvent.interfaces";
import { dummyPromise } from "../../shared/util/testingUtils";
import { getDummyCalendarEvents } from "./demoAppointments";

const CalendarScreen = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { id } = useParams<{ id: string }>();
  const { userProfile } = useSelector(selectUserState);

  const [currentEventEdit, setCurrentEventEdit] = useState<string | "new">("new");
  const [showOverlay, setShowOverlay] = useState(false);

  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [fetchedCalendarEvents, setFetchedCalendarEvents] = useState<ICalendarEvent[]>([]);

  const fetchCalendarEvents = useCallback(async () => {
    setIsCalendarLoading(true);

    await dummyPromise(1500);

    setFetchedCalendarEvents(getDummyCalendarEvents());
    setIsCalendarLoading(false);
  }, []);

  useEffect(() => {
    fetchCalendarEvents();
  }, [fetchCalendarEvents]);

  useEffect(() => {
    if (id) {
      setCurrentEventEdit(id.toLowerCase());
      setShowOverlay(true);
    }
  }, [id]);

  const handleShowNewDialog = useCallback(() => {
    navigate("new");
  }, [navigate]);

  const handleHideDialog = useCallback(() => {
    setShowOverlay(false);
    navigate("/calendar");
    setCurrentEventEdit("new");
  }, [navigate]);

  return (
    <>
      <EventFormDialog
        eventId={currentEventEdit}
        ownerId={userProfile?.userId ?? ""}
        showDialog={showOverlay}
        handleClose={handleHideDialog}
        handleRefreshList={handleHideDialog}
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
          maxHeight={isOnMobile ? 600 : 780}
          showOverlay={showOverlay}
          handleHideOverlay={handleHideDialog}
          isCalendarLoading={isCalendarLoading}
          calendarEvents={fetchedCalendarEvents}
        />
      </PagePaperWrapper>
    </>
  );
};

export default CalendarScreen;
