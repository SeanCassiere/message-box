import { styled, alpha } from "@mui/material/styles";
import { MonthView, WeekView, AllDayPanel, DayView } from "@devexpress/dx-react-scheduler-material-ui";
import { useNavigate } from "react-router-dom";
import classNames from "clsx";

import { classes, isWeekEnd } from "./common";

/**
 * @description use for styling the time table cell in the month view
 */
const StyledMonthViewTimeTableCell = styled(MonthView.TimeTableCell)(({ theme: { palette } }) => ({
  [`&.${classes.weekEndCell}`]: {
    backgroundColor: alpha(palette.action.disabledBackground, 0.04),
    "&:hover": {
      backgroundColor: alpha(palette.action.disabledBackground, 0.04),
    },
    "&:focus": {
      backgroundColor: alpha(palette.action.disabledBackground, 0.04),
    },
  },
}));

export const MonthViewTimeTableCell = ({ startDate, ...restProps }: MonthView.TimeTableCellProps) => {
  const navigate = useNavigate();

  const customOnDoubleClick = () => {
    navigate("/calendar/new", {
      state: {
        startDate: startDate,
        endDate: restProps?.endDate,
        isAllDay: true,
      },
    });
  };

  return (
    <StyledMonthViewTimeTableCell
      className={classNames({
        [classes.weekEndCell]: isWeekEnd(startDate!),
      })}
      startDate={startDate}
      {...restProps}
      onDoubleClick={customOnDoubleClick}
    />
  );
};

/**
 * @description use for styling the time table cell in the week view
 */
const StyledWeekViewTimeTableCell = styled(WeekView.TimeTableCell)(({ theme: { palette } }) => ({
  [`&.${classes.weekEndCell}`]: {
    backgroundColor: alpha(palette.action.disabledBackground, 0.06),
    "&:hover": {
      backgroundColor: alpha(palette.action.disabledBackground, 0.04),
    },
    "&:focus": {
      backgroundColor: alpha(palette.action.disabledBackground, 0.04),
    },
  },
}));
export const WeekViewTimeTableCell = ({ startDate, onDoubleClick, ...restProps }: WeekView.TimeTableCellProps) => {
  const navigate = useNavigate();

  const customOnDoubleClick = () => {
    navigate("/calendar/new", {
      state: {
        startDate: startDate,
        endDate: restProps?.endDate,
        isAllDay: false,
      },
    });
  };

  return (
    <StyledWeekViewTimeTableCell
      className={classNames({
        [classes.weekEndCell]: isWeekEnd(startDate!),
      })}
      onDoubleClick={customOnDoubleClick}
      startDate={startDate}
      {...restProps}
    />
  );
};

/**
 * @description use for styling the cell in the all-day view
 */
const StyledAllDayViewCell = styled(AllDayPanel.Cell)(({ theme: { palette } }) => ({
  [`&.${classes.weekEndCell}`]: {
    backgroundColor: alpha(palette.action.disabledBackground, 0.06),
    "&:hover": {
      backgroundColor: alpha(palette.action.disabledBackground, 0.04),
    },
    "&:focus": {
      backgroundColor: alpha(palette.action.disabledBackground, 0.04),
    },
  },
}));
export const AllDayViewCell = ({ startDate, ...restProps }: AllDayPanel.CellProps) => {
  const navigate = useNavigate();

  const customOnDoubleClick = () => {
    navigate("/calendar/new", {
      state: {
        startDate: startDate,
        endDate: restProps?.endDate,
        isAllDay: true,
      },
    });
  };

  return (
    <StyledAllDayViewCell
      className={classNames({
        [classes.weekEndCell]: isWeekEnd(startDate!),
      })}
      startDate={startDate}
      {...restProps}
      onDoubleClick={customOnDoubleClick}
    />
  );
};

/**
 * @description use for styling the cell in the single-day view
 */
const StyledDayViewTimeTableCell = styled(DayView.TimeTableCell)(({ theme: { palette } }) => ({
  [`&.${classes.weekEndCell}`]: {
    backgroundColor: alpha(palette.action.disabledBackground, 0.06),
    "&:hover": {
      backgroundColor: alpha(palette.action.disabledBackground, 0.04),
    },
    "&:focus": {
      backgroundColor: alpha(palette.action.disabledBackground, 0.04),
    },
  },
}));
export const DayViewTimeTableCell = ({ startDate, ...restProps }: DayView.TimeTableCellProps) => {
  const navigate = useNavigate();

  const customOnDoubleClick = () => {
    navigate("/calendar/new", {
      state: {
        startDate: startDate,
        endDate: restProps?.endDate,
        isAllDay: false,
      },
    });
  };

  return (
    <StyledDayViewTimeTableCell
      className={classNames({
        [classes.weekEndCell]: isWeekEnd(startDate!),
      })}
      startDate={startDate}
      {...restProps}
      onDoubleClick={customOnDoubleClick}
    />
  );
};
