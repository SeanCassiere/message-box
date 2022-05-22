import React, { memo } from "react";
import { styled, alpha } from "@mui/material/styles";
import { MonthView, WeekView, AllDayPanel, DayView } from "@devexpress/dx-react-scheduler-material-ui";
import { useNavigate } from "react-router-dom";
import classNames from "clsx";

import { classes, isWeekEnd } from "./common";

export type TypeFreeCellDoubleClickFunction = (
  startDate: Date | undefined,
  endDate: Date | undefined,
  isAllDay: boolean
) => void;

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

export const MonthViewTimeTableCell = memo(
  ({
    startDate,
    overridingClickHandler,
    ...restProps
  }: MonthView.TimeTableCellProps & {
    overridingClickHandler?: TypeFreeCellDoubleClickFunction;
  }) => {
    const navigate = useNavigate();

    const customOnDoubleClick = () => {
      if (overridingClickHandler) {
        overridingClickHandler(startDate, restProps?.endDate, true);
      } else {
        navigate("/calendar/new", {
          state: {
            startDate: startDate,
            endDate: restProps?.endDate,
            isAllDay: true,
          },
        });
      }
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
  }
);

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
export const WeekViewTimeTableCell = memo(
  ({
    startDate,
    onDoubleClick,
    overridingClickHandler,
    ...restProps
  }: WeekView.TimeTableCellProps & {
    overridingClickHandler?: TypeFreeCellDoubleClickFunction;
  }) => {
    const navigate = useNavigate();

    const customOnDoubleClick = () => {
      if (overridingClickHandler) {
        overridingClickHandler(startDate, restProps?.endDate, false);
      } else {
        navigate("/calendar/new", {
          state: {
            startDate: startDate,
            endDate: restProps?.endDate,
            isAllDay: false,
          },
        });
      }
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
  }
);

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
export const AllDayViewCell = memo(
  ({
    startDate,
    overridingClickHandler,
    ...restProps
  }: AllDayPanel.CellProps & {
    overridingClickHandler?: TypeFreeCellDoubleClickFunction;
  }) => {
    const navigate = useNavigate();

    const customOnDoubleClick = () => {
      if (overridingClickHandler) {
        overridingClickHandler(startDate, restProps?.endDate, true);
      } else {
        navigate("/calendar/new", {
          state: {
            startDate: startDate,
            endDate: restProps?.endDate,
            isAllDay: true,
          },
        });
      }
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
  }
);

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
export const DayViewTimeTableCell = memo(
  ({
    startDate,
    overridingClickHandler,
    ...restProps
  }: DayView.TimeTableCellProps & {
    overridingClickHandler?: TypeFreeCellDoubleClickFunction;
  }) => {
    const navigate = useNavigate();

    const customOnDoubleClick = () => {
      if (overridingClickHandler) {
        overridingClickHandler(startDate, restProps?.endDate, false);
      } else {
        navigate("/calendar/new", {
          state: {
            startDate: startDate,
            endDate: restProps?.endDate,
            isAllDay: false,
          },
        });
      }
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
  }
);
