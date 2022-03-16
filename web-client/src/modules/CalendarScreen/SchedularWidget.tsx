// ref: https://devexpress.github.io/devextreme-reactive/react/scheduler/demos/featured/remote-data/
// ref: https://devexpress.github.io/devextreme-reactive/react/scheduler/docs/guides/appointments/
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ViewState } from "@devexpress/dx-react-scheduler";
import { useTheme } from "@mui/material/styles";
import {
  Scheduler,
  WeekView,
  DayView,
  Appointments,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  AppointmentForm,
  AppointmentTooltip,
  TodayButton,
  AllDayPanel,
  MonthView,
  CurrentTimeIndicator,
  Resources,
} from "@devexpress/dx-react-scheduler-material-ui";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import DateNavigatorButtonComponent from "../../shared/components/Calendar/DateNavigatorButtonComponent";
import ViewSwitcherComponent from "../../shared/components/Calendar/ViewSwitcherComponent";
import ToolbarWithLoading from "../../shared/components/Calendar/ToolbarWithLoading";
import AppointmentComponent from "../../shared/components/Calendar/AppointmentComponent";
import AppointmentContentComponent from "../../shared/components/Calendar/AppointmentContentComponent";

import { ICalendarEvent } from "../../shared/interfaces/CalendarEvent.interfaces";
import { resources } from "../../shared/components/Calendar/common";

interface ICustomCalendarSchedularProps {
  maxHeight?: number;
  showOverlay: boolean;
  handleHideOverlay: () => void;
  isCalendarLoading: boolean;
  calendarEvents: ICalendarEvent[];
}

const CalendarSchedular = (parentProps: ICustomCalendarSchedularProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [calCurrentDate, setCalCurrentDate] = useState(new Date());
  const setCurrentDateHandler = useCallback((dateInput: Date) => {
    setCalCurrentDate(dateInput);
  }, []);

  const [calCurrentViewNameState, setCalCurrentViewNameState] = useState("Week");
  const setCurrentViewNameHandler = useCallback((viewName: string) => {
    setCalCurrentViewNameState(viewName);
  }, []);

  return (
    <Paper>
      <Scheduler data={parentProps.calendarEvents} height={parentProps.maxHeight ?? 780}>
        <ViewState
          currentDate={calCurrentDate}
          onCurrentDateChange={setCurrentDateHandler}
          currentViewName={calCurrentViewNameState}
          onCurrentViewNameChange={setCurrentViewNameHandler}
        />
        <DayView startDayHour={1} endDayHour={23} />
        <MonthView />
        <WeekView startDayHour={7} endDayHour={18.5} />
        <AllDayPanel />
        <Appointments
          appointmentComponent={(compProps) => (
            <AppointmentComponent
              {...compProps}
              handleAppointmentDoubleClick={(eventId) => {
                navigate(`/calendar/${eventId}`);
              }}
            />
          )}
          appointmentContentComponent={AppointmentContentComponent}
        />
        <CurrentTimeIndicator updateInterval={6000} />
        <Toolbar {...(parentProps.isCalendarLoading ? { rootComponent: ToolbarWithLoading } : null)} />
        {!isOnMobile && <DateNavigator openButtonComponent={DateNavigatorButtonComponent} />}
        <ViewSwitcher switcherComponent={ViewSwitcherComponent} />
        <TodayButton />
        <Resources data={resources} />
        <AppointmentTooltip
          showOpenButton
          showCloseButton
          showDeleteButton
          headerComponent={(props: AppointmentTooltip.HeaderProps) => {
            const CommandButton = props.commandButtonComponent;

            const openClose = () => {
              navigate(`${props.appointmentData?.id ? props.appointmentData.id : "new"}`);
              if (props.onHide) {
                props?.onHide();
              }
            };

            return (
              <Paper sx={{ pt: 1, pb: 1, pr: 1 }}>
                <Grid container spacing={1} justifyContent="end">
                  <Grid item>{props.showOpenButton && <CommandButton id="open" onExecute={openClose} />}</Grid>

                  <Grid item>
                    {props.showDeleteButton && <CommandButton id="delete" onExecute={props.onDeleteButtonClick} />}
                  </Grid>
                  <Grid item>{props.showCloseButton && <CommandButton id="close" onExecute={props.onHide} />}</Grid>
                </Grid>
              </Paper>
            );
          }}
        />
        <AppointmentForm visible={false} />
      </Scheduler>
    </Paper>
  );
};

export default CalendarSchedular;
