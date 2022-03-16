import classNames from "clsx";
import { styled } from "@mui/material/styles";
import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";

import { classes } from "./common";

const StyledAppointmentsAppointmentContent = styled(Appointments.AppointmentContent)(({ theme: { palette } }) => ({
  [`& .${classes.text}`]: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: 14,
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
  [`& .${classes.content}`]: {
    fontSize: 12,
    fontWeight: 500,
    opacity: 0.7,
  },
  [`& .${classes.container}`]: {
    width: "100%",
    lineHeight: 1.4,
    height: "100%",
  },
}));

const AppointmentContentComponent = ({ data, ...restProps }: Appointments.AppointmentContentProps) => {
  return (
    <StyledAppointmentsAppointmentContent {...restProps} data={data}>
      <div className={classes.container}>
        <div className={classes.text}>{data.title}</div>
        {restProps.type === "vertical" && data.description.length > 0 && (
          <div className={classNames(classes.text, classes.content)}>{`Description: ${data.description}`}</div>
        )}
      </div>
    </StyledAppointmentsAppointmentContent>
  );
};

export default AppointmentContentComponent;
