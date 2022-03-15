// ref: https://devexpress.github.io/devextreme-reactive/react/scheduler/demos/featured/remote-data/
// ref: https://devexpress.github.io/devextreme-reactive/react/scheduler/docs/guides/appointments/
import { useState, useCallback } from "react";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import { ViewState } from "@devexpress/dx-react-scheduler";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
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
  CurrentTimeIndicator,
} from "@devexpress/dx-react-scheduler-material-ui";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Grid from "@mui/material/Grid";

import { getDummyCalendarEvents } from "./demoAppointments";

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
  showOverlay: boolean;
  handleHideOverlay: () => void;
}

const CalendarSchedular = (parentProps: ICustomCalendarSchedularProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [calLoadingState] = useState(false);

  const [calendarEvents] = useState(getDummyCalendarEvents());

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
      <Scheduler data={calendarEvents} height={parentProps.maxHeight ?? 780}>
        <ViewState
          currentDate={calCurrentDate}
          onCurrentDateChange={setCurrentDateHandler}
          currentViewName={calCurrentViewNameState}
          onCurrentViewNameChange={setCurrentViewNameHandler}
        />
        <DayView startDayHour={1} endDayHour={23} />
        <WeekView startDayHour={7} endDayHour={18.5} />
        <AllDayPanel />
        <Appointments
        // appointmentComponent={(appointmentProps) => {
        //   return (
        //     <Paper
        //       {...appointmentProps}
        //       onClick={(e) => {
        //         if (appointmentProps.onClick) {
        //           appointmentProps.onClick(appointmentProps.data);
        //         }
        //       }}
        //       elevation={0}
        //       sx={{
        //         bgcolor: "primary.400",
        //         height: "100%",
        //         borderWidth: 2,
        //         borderStyle: "solid",
        //         borderColor: "primary.600",
        //         borderRadius: 2,
        //       }}
        //       onDoubleClick={(e) => {
        //         e.preventDefault();
        //         e.stopPropagation();
        //         navigate(appointmentProps.data.id ? `${appointmentProps.data?.id}` : "new");
        //       }}
        //     >
        //       {appointmentProps.children}
        //     </Paper>
        //   );
        // }}
        />
        <CurrentTimeIndicator updateInterval={6000} />
        <Toolbar {...(calLoadingState ? { rootComponent: ToolbarWithLoading } : null)} />
        {!isOnMobile && <DateNavigator openButtonComponent={DateNavigatorButtonComponent} />}
        <ViewSwitcher switcherComponent={SwitcherComponent} />
        <TodayButton />
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

const SwitcherComponent = ({
  currentView: switcherCurrentView,
  onChange: onViewChange,
  availableViews,
}: ViewSwitcher.SwitcherProps) => {
  const handleChangingView = (event: SelectChangeEvent<string>) => {
    onViewChange(event.target.value);
  };
  return (
    <Select
      value={switcherCurrentView.name}
      onChange={handleChangingView}
      size="small"
      displayEmpty
      inputProps={{ "aria-label": "Without label" }}
      color="primary"
      variant="outlined"
    >
      {availableViews.map((view) => (
        <MenuItem key={`view-item-${view.name}`} value={view.name}>
          {view.displayName}
        </MenuItem>
      ))}
    </Select>
  );
};

const DateNavigatorButtonComponent = ({ onVisibilityToggle, text }: DateNavigator.OpenButtonProps) => (
  <Button onClick={onVisibilityToggle} variant="outlined">
    {text}
  </Button>
);

export default CalendarSchedular;
