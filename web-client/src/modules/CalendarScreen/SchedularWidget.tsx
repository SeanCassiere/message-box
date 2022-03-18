// ref: https://devexpress.github.io/devextreme-reactive/react/scheduler/demos/featured/remote-data/
// ref: https://devexpress.github.io/devextreme-reactive/react/scheduler/docs/guides/appointments/
import useMediaQuery from "@mui/material/useMediaQuery";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ViewState, EditingState, IntegratedEditing } from "@devexpress/dx-react-scheduler";
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
  DragDropProvider,
} from "@devexpress/dx-react-scheduler-material-ui";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";

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

import { ICalendarEventBase } from "../../shared/interfaces/CalendarEvent.interfaces";
import { resources } from "../../shared/components/Calendar/common";
import { COMMON_ITEM_BORDER_STYLING } from "../../shared/util/constants";
import { selectUserState } from "../../shared/redux/store";

interface LOCAL_ChangesSet {
  added?: {
    [key: string]: any;
  };
  changed?: {
    [key: string]: any;
  };
  deleted?: number | string;
}

interface ICustomCalendarSchedularProps {
  maxHeight?: number;
  isCalendarLoading: boolean;
  calendarEvents: ICalendarEventBase[];
  viewName: string;
  openDeleteOverlay?: (id: string | null) => void;
  calendarViewingDate: Date;
  setCalendarViewingDate: (date: Date, viewName: string) => void;
  setCalendarViewName: (viewName: string) => void;
  handlePatchAppointment: ({ id, startDate, endDate }: { id: string; startDate: string; endDate: string }) => void;
}

const CalendarSchedular = (parentProps: ICustomCalendarSchedularProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { userProfile } = useSelector(selectUserState);

  const handleDoubleClickOnAppointment = useCallback(
    (eventId: string) => {
      navigate(`/calendar/${eventId}`);
    },
    [navigate]
  );

  const handlePatchingAppointment = useCallback(
    (changeSet: LOCAL_ChangesSet) => {
      if (changeSet.changed) {
        console.log(changeSet.changed);
        const changedItems = Array.from(Object.entries(changeSet.changed));

        if (!changedItems[0]) return;

        const [id, changedItem] = changedItems[0] as [string, { startDate: Date; endDate: Date }];

        parentProps.handlePatchAppointment({
          id,
          startDate: changedItem.startDate.toISOString(),
          endDate: changedItem.endDate.toISOString(),
        });
      }
    },
    [parentProps]
  );

  const canDrag = useCallback(
    (id: String) => {
      return userProfile?.userId === id;
    },
    [userProfile?.userId]
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
        <EditingState onCommitChanges={handlePatchingAppointment} />
        <IntegratedEditing />
        <DayView timeTableCellComponent={DayViewTimeTableCell} name="Day" displayName="One Day" cellDuration={60} />
        <DayView
          timeTableCellComponent={DayViewTimeTableCell}
          name="3-days"
          displayName="3 Days"
          intervalCount={3}
          cellDuration={60}
        />
        <WeekView timeTableCellComponent={WeekViewTimeTableCell} cellDuration={60} />
        <AllDayPanel cellComponent={AllDayViewCell} />
        <MonthView timeTableCellComponent={MonthViewTimeTableCell} />
        <Appointments
          appointmentComponent={(compProps) => (
            <AppointmentComponent {...compProps} handleAppointmentDoubleClick={handleDoubleClickOnAppointment} />
          )}
          appointmentContentComponent={AppointmentContentComponent}
        />
        <Resources data={resources} />
        <Toolbar {...(parentProps.isCalendarLoading ? { rootComponent: ToolbarWithLoading } : null)} />
        {!isOnMobile && <DateNavigator openButtonComponent={DateNavigatorOpenButtonComponent} />}
        <ViewSwitcher switcherComponent={ViewSwitcherComponent} />
        <TodayButton />
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
        <DragDropProvider
          allowDrag={(eventObject) => canDrag(`${eventObject.ownerId}`)}
          allowResize={(eventObject) => canDrag(`${eventObject.ownerId}`)}
        />
        <CurrentTimeIndicator updateInterval={6000} />
      </Scheduler>
    </Paper>
  );
};

export default CalendarSchedular;
