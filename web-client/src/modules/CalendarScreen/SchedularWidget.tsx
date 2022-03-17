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
  // AppointmentForm,
  AppointmentTooltip,
  TodayButton,
  AllDayPanel,
  MonthView,
  CurrentTimeIndicator,
  Resources,
} from "@devexpress/dx-react-scheduler-material-ui";
import Paper from "@mui/material/Paper";
// import Box from "@mui/material/Box";

import DateNavigatorButtonComponent from "../../shared/components/Calendar/DateNavigatorButtonComponent";
import ViewSwitcherComponent from "../../shared/components/Calendar/ViewSwitcherComponent";
import ToolbarWithLoading from "../../shared/components/Calendar/ToolbarWithLoading";
import AppointmentTooltipHeaderComponent from "../../shared/components/Calendar/AppointmentTooltipHeaderComponent";
import AppointmentComponent from "../../shared/components/Calendar/AppointmentComponent";
import AppointmentContentComponent from "../../shared/components/Calendar/AppointmentContentComponent";
import {
  MonthViewTimeTableCell,
  WeekViewTimeTableCell,
  AllDayViewCell,
  DayViewTimeTableCell,
} from "../../shared/components/Calendar/TimeTableCell";

import { ICalendarEvent } from "../../shared/interfaces/CalendarEvent.interfaces";
import { resources } from "../../shared/components/Calendar/common";
import { COMMON_ITEM_BORDER_STYLING } from "../../shared/util/constants";

interface ICustomCalendarSchedularProps {
  maxHeight?: number;
  isCalendarLoading: boolean;
  calendarEvents: ICalendarEvent[];
  openDeleteOverlay?: (id: string | null) => void;
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

  const handleDoubleClickOnAppointment = useCallback(
    (eventId: string) => {
      navigate(`/calendar/${eventId}`);
    },
    [navigate]
  );

  return (
    <Paper
      elevation={0}
      sx={{
        height: parentProps.maxHeight ?? 780,
        border: COMMON_ITEM_BORDER_STYLING,
        borderRadius: 1,
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      }}
    >
      <Scheduler data={parentProps.calendarEvents} height="auto">
        <ViewState
          currentDate={calCurrentDate}
          onCurrentDateChange={setCurrentDateHandler}
          currentViewName={calCurrentViewNameState}
          onCurrentViewNameChange={setCurrentViewNameHandler}
        />
        <DayView timeTableCellComponent={DayViewTimeTableCell} startDayHour={1} endDayHour={23} />
        <WeekView timeTableCellComponent={WeekViewTimeTableCell} startDayHour={7} endDayHour={20} />
        <AllDayPanel cellComponent={AllDayViewCell} />
        <MonthView timeTableCellComponent={MonthViewTimeTableCell} />
        <Appointments
          appointmentComponent={(compProps) => (
            <AppointmentComponent {...compProps} handleAppointmentDoubleClick={handleDoubleClickOnAppointment} />
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
          headerComponent={(props) => (
            <AppointmentTooltipHeaderComponent
              {...props}
              openDeleteOverlay={parentProps.openDeleteOverlay}
              customOnOpenClose={handleDoubleClickOnAppointment}
            />
          )}
        />
        {/* <AppointmentForm visible={false} /> */}
      </Scheduler>
    </Paper>
  );
};

export default CalendarSchedular;
