import { memo } from "react";
import classNames from "clsx";
import { styled } from "@mui/material/styles";
import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";

import { classes } from "./common";
import { useSelector } from "react-redux";
import { selectLookupListsState, selectUserState } from "../../redux/store";
import { useMemo } from "react";

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
  const { userProfile } = useSelector(selectUserState);
  const { usersList } = useSelector(selectLookupListsState);

  const name = useMemo(() => {
    const user = usersList.find((u) => u.userId === data.ownerId);
    return user ? `${user.firstName} ${user.lastName}` : "No name";
  }, [data.ownerId, usersList]);
  return (
    <StyledAppointmentsAppointmentContent {...restProps} data={data}>
      <div className={classes.container}>
        <div className={classes.text}>{data.title}</div>
        {restProps.type === "vertical" && data.description?.length > 0 && (
          <div className={classNames(classes.text, classes.content)}>{`Description: ${data.description}`}</div>
        )}
        {restProps.type === "vertical" && (
          <div className={classNames(classes.text, classes.content)}>
            Guests:&nbsp;{data.sharedWith.length === 0 ? "None" : "Yes"}
          </div>
        )}
        {restProps.type === "vertical" && data.ownerId !== userProfile?.userId && (
          <div className={classNames(classes.text, classes.content)}>By:&nbsp;{name}</div>
        )}
      </div>
    </StyledAppointmentsAppointmentContent>
  );
};

export default memo(AppointmentContentComponent);
