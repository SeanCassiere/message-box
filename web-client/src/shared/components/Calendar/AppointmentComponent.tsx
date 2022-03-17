import classNames from "clsx";
import { styled } from "@mui/material/styles";
import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";
import { indigo, deepPurple, teal, lightGreen } from "@mui/material/colors";
import { useSelector } from "react-redux";

import { selectUserState } from "../../../shared/redux/store";
import { classes } from "./common";

const StyledAppointmentsAppointment = styled(Appointments.Appointment)(({ theme }) => ({
  [`&.${classes.appointment}`]: {
    borderRadius: 5,
    borderBottom: `1px solid ${indigo[100]}`,
  },
  [`&.${classes.ownEventAlone}`]: {
    borderLeft: `4px solid ${teal[600]}`,
    backgroundColor: teal[300],
    transition: "background-color 0.15s ease-in-out",
    "&:hover": {
      backgroundColor: teal[200],
    },
  },
  [`&.${classes.ownEventWithGuests}`]: {
    borderLeft: `4px solid ${deepPurple[600]}`,
    backgroundColor: deepPurple[300],
    transition: "background-color 0.15s ease-in-out",
    "&:hover": {
      backgroundColor: deepPurple[200],
    },
  },
  [`&.${classes.guestToAnotherEvent}`]: {
    borderLeft: `4px solid ${lightGreen[600]}`,
    backgroundColor: lightGreen[400],
    transition: "background-color 0.15s ease-in-out",
    "&:hover": {
      backgroundColor: lightGreen[300],
    },
  },
}));

const AppointmentComponent = ({
  data,
  handleAppointmentDoubleClick,
  onDoubleClick,
  ...restProps
}: Appointments.AppointmentProps & { handleAppointmentDoubleClick: (eventId: string) => void }) => {
  const { userProfile } = useSelector(selectUserState);

  const doubleClick = (e: any) => {
    if (onDoubleClick) {
      onDoubleClick(e);
    }
    handleAppointmentDoubleClick(`${data.id}`);
  };

  return (
    <StyledAppointmentsAppointment
      {...restProps}
      onDoubleClick={doubleClick}
      className={classNames({
        [classes.ownEventAlone]: data.ownerId === userProfile?.userId && data.sharedWith.length === 0,
        [classes.ownEventWithGuests]: data.ownerId === userProfile?.userId && data.sharedWith.length > 0,
        [classes.guestToAnotherEvent]: data.ownerId !== userProfile?.userId,
        [classes.appointment]: true,
      })}
      data={data}
    />
  );
};

export default AppointmentComponent;
