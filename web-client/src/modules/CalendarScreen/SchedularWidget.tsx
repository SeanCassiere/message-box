// ref: https://devexpress.github.io/devextreme-reactive/react/scheduler/demos/featured/remote-data/
// ref: https://devexpress.github.io/devextreme-reactive/react/scheduler/docs/guides/appointments/
import useMediaQuery from "@mui/material/useMediaQuery";
import { useCallback } from "react";
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

import DateNavigatorOpenButtonComponent from "../../shared/components/Calendar/DateNavigatorOpenButtonComponent";
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
  viewName: string;
  openDeleteOverlay?: (id: string | null) => void;
  calendarViewingDate: Date;
  setCalendarViewingDate: (date: Date, viewName: string) => void;
  setCalendarViewName: (viewName: string) => void;
}

const CalendarSchedular = (parentProps: ICustomCalendarSchedularProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        // height: parentProps.maxHeight ?? 780,
        border: COMMON_ITEM_BORDER_STYLING,
        borderRadius: 1,
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      }}
    >
      <Scheduler data={parentProps.calendarEvents} height="auto">
        <ViewState
          currentDate={parentProps.calendarViewingDate}
          onCurrentDateChange={(date) => parentProps.setCalendarViewingDate(date, parentProps.viewName)}
          currentViewName={parentProps.viewName}
          onCurrentViewNameChange={parentProps.setCalendarViewName}
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
        {!isOnMobile && <DateNavigator openButtonComponent={DateNavigatorOpenButtonComponent} />}
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
        <AppointmentForm
          visible={false}
          // leave visible as false since the tooltip component uses it for anchoring, even though the form is not visible
        />
      </Scheduler>
    </Paper>
  );
};

export default CalendarSchedular;
