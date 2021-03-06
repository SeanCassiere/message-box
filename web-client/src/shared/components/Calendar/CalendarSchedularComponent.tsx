// ref: https://devexpress.github.io/devextreme-reactive/react/scheduler/demos/featured/remote-data/
// ref: https://devexpress.github.io/devextreme-reactive/react/scheduler/docs/guides/appointments/
import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
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
import { grey } from "@mui/material/colors";

import DateNavigatorOpenButtonComponent from "./DateNavigatorOpenButtonComponent";
import ViewSwitcherComponent from "./ViewSwitcherComponent";
import ToolbarWithLoading from "./ToolbarWithLoading";
import AppointmentTooltipHeaderComponent from "./AppointmentTooltipHeaderComponent";
import AppointmentComponent from "./AppointmentComponent";
import AppointmentContentComponent from "./AppointmentContentComponent";
import {
  MonthViewTimeTableCell,
  WeekViewTimeTableCell,
  AllDayViewCell,
  DayViewTimeTableCell,
  TypeFreeCellDoubleClickFunction,
} from "./TimeTableCell";

import { ICalendarEventBase } from "../../interfaces/CalendarEvent.interfaces";
import { resources } from "./common";
import { selectUserState } from "../../redux/store";

interface ICalendarPatchChanges {
  added?: {
    [key: string]: any;
  };
  changed?: {
    [key: string]: any;
  };
  deleted?: number | string;
}

interface ICustomCalendarSchedularProps {
  viewName: string;
  calendarViewingDate: Date;
  calendarEvents: ICalendarEventBase[];
  isCalendarLoading: boolean;
  handleDoubleClickAppointment: (eventId: string) => void;
  handlePatchAppointment: ({ id, startDate, endDate }: { id: string; startDate: string; endDate: string }) => void;
  setCalendarViewingDate: (date: Date, viewName: string) => void;

  handleDoubleClickFreeCell?: TypeFreeCellDoubleClickFunction;
  setCalendarViewName?: (viewName: string) => void;
  openDeleteOverlay?: (id: string | null) => void;
  maxHeight?: number;
  turnOffViewSwitching?: boolean;
}

const CalendarSchedularComponent = (parentProps: ICustomCalendarSchedularProps) => {
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { userProfile } = useSelector(selectUserState);

  const handlePatchingAppointment = React.useCallback(
    (changeSet: ICalendarPatchChanges) => {
      if (changeSet.changed) {
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

  const canDrag = React.useCallback(
    (id: String) => {
      return userProfile?.userId === id;
    },
    [userProfile?.userId]
  );

  return (
    <Paper
      elevation={0}
      sx={{
        height: parentProps.maxHeight || undefined,
        bgcolor: theme.palette.mode === "light" ? theme.palette.background.paper : grey[900],
        // border: COMMON_ITEM_BORDER_STYLING,
        // borderRadius: 1,
        // boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
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
        <DayView
          timeTableCellComponent={(props) => (
            <DayViewTimeTableCell {...props} overridingClickHandler={parentProps.handleDoubleClickFreeCell} />
          )}
          name="Day"
          displayName="One Day"
          cellDuration={60}
        />
        <DayView
          timeTableCellComponent={(props) => (
            <DayViewTimeTableCell {...props} overridingClickHandler={parentProps.handleDoubleClickFreeCell} />
          )}
          name="3-days"
          displayName="3 Days"
          intervalCount={3}
          cellDuration={60}
        />
        <WeekView
          timeTableCellComponent={(props) => (
            <WeekViewTimeTableCell {...props} overridingClickHandler={parentProps.handleDoubleClickFreeCell} />
          )}
          cellDuration={60}
        />
        <AllDayPanel
          cellComponent={(props) => (
            <AllDayViewCell {...props} overridingClickHandler={parentProps.handleDoubleClickFreeCell} />
          )}
        />
        <MonthView
          timeTableCellComponent={(props) => (
            <MonthViewTimeTableCell {...props} overridingClickHandler={parentProps.handleDoubleClickFreeCell} />
          )}
        />
        <Appointments
          appointmentComponent={(compProps) => (
            <AppointmentComponent
              {...compProps}
              handleAppointmentDoubleClick={parentProps.handleDoubleClickAppointment}
            />
          )}
          appointmentContentComponent={AppointmentContentComponent}
        />
        <Resources data={resources} />
        <Toolbar {...(parentProps.isCalendarLoading ? { rootComponent: ToolbarWithLoading } : null)} />
        {!isOnMobile && <DateNavigator openButtonComponent={DateNavigatorOpenButtonComponent} />}
        {!parentProps.turnOffViewSwitching && <ViewSwitcher switcherComponent={ViewSwitcherComponent} />}
        <TodayButton />
        <AppointmentTooltip
          showOpenButton
          showCloseButton
          showDeleteButton
          headerComponent={(props) => (
            <AppointmentTooltipHeaderComponent
              {...props}
              openDeleteOverlay={parentProps.openDeleteOverlay}
              customOnOpenClose={parentProps.handleDoubleClickAppointment}
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

export default React.memo(CalendarSchedularComponent);
