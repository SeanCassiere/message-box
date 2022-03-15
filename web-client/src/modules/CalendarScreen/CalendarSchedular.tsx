// ref: https://devexpress.github.io/devextreme-reactive/react/scheduler/demos/featured/remote-data/
import { useState, useCallback } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";
import { ViewState } from "@devexpress/dx-react-scheduler";
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
} from "@devexpress/dx-react-scheduler-material-ui";

import { appointments } from "./demoAppointments";

const PREFIX = "MessageBox";

const classes = {
  toolbarRoot: `${PREFIX}-toolbarRoot`,
  progress: `${PREFIX}-progress`,
};

const StyledDiv = styled("div")({
  [`&.${classes.toolbarRoot}`]: {
    position: "relative",
  },
});

const StyledLinearProgress = styled(LinearProgress)(() => ({
  [`&.${classes.progress}`]: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    left: 0,
  },
}));

const ToolbarWithLoading = ({ children, ...restProps }: any) => (
  <StyledDiv className={classes.toolbarRoot}>
    <Toolbar.Root {...restProps}>{children}</Toolbar.Root>
    <StyledLinearProgress className={classes.progress} />
  </StyledDiv>
);

interface ICustomCalendarSchedularProps {
  maxHeight?: number;
}

const CalendarSchedular = (props: ICustomCalendarSchedularProps) => {
  // const {maxHeight} = props

  const [calLoadingState] = useState(false);

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
      <Scheduler data={appointments} height={props.maxHeight ?? 780}>
        <ViewState
          currentDate={calCurrentDate}
          onCurrentDateChange={setCurrentDateHandler}
          currentViewName={calCurrentViewNameState}
          onCurrentViewNameChange={setCurrentViewNameHandler}
        />
        <DayView startDayHour={7.5} endDayHour={17.5} />
        <WeekView startDayHour={7.5} endDayHour={17.5} />
        <AllDayPanel />
        <Appointments />
        <Toolbar {...(calLoadingState ? { rootComponent: ToolbarWithLoading } : null)} />
        <DateNavigator />
        <TodayButton />
        <ViewSwitcher />
        <AppointmentTooltip showOpenButton showCloseButton />
        <AppointmentForm />
      </Scheduler>
    </Paper>
  );
};

export default CalendarSchedular;
