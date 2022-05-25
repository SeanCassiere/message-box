import React from "react";
import { CSSObject } from "@emotion/react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import { indigo, red } from "@mui/material/colors";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";

import { ITeamMember } from "../../../interfaces/Client.interfaces";
import { selectLookupListsState, selectUserState } from "../../../redux/store";
import { stringAvatar } from "../../Layout/NavigationWrapper/navUtils";
import { socket_activateInactivityPromptForUser } from "../../../api/socket.service";

interface IProps {
  member: ITeamMember;
}

const EmployeeCard = (props: IProps) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { onlineUsersList } = useSelector(selectLookupListsState);
  const { statusList } = useSelector(selectUserState);

  const onlineMember = onlineUsersList.find((user) => user.userId === props.member.userId);

  const currentStatus = onlineMember ? onlineMember.status : "Offline";
  const badgeColor = React.useMemo(() => {
    const findStatus = statusList.find((status) => status.status === currentStatus);

    if (!findStatus) return red[300];

    return findStatus.color;
  }, [currentStatus, statusList]);

  const [messageSent, setSentMessage] = React.useState(false);

  const employeeCardStyling: CSSObject = {
    mx: 1,
    px: 1,
    py: 1,
    borderColor: theme.palette.mode === "light" ? "primary.200" : "#292929",
    borderWidth: 2,
    borderStyle: "solid",
    minHeight: "200px",
    backgroundColor: theme.palette.mode === "light" ? "white" : undefined,
    "&:hover": {
      boxShadow: "0 3px 3px rgba(0,0,0,0.16)",
    },
  };

  return (
    <Paper sx={employeeCardStyling} elevation={0}>
      <Stack direction="column" sx={{ height: "100%" }}>
        <Grid container sx={{ mb: 2 }} alignItems="center">
          <Grid item xs={3} sx={{ textAlign: "center" }}>
            <Badge
              overlap="circular"
              variant="dot"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: badgeColor,
                  color: badgeColor,
                  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                  "&::after": {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    border: "1px solid currentColor",
                    content: '""',
                  },
                },
              }}
            >
              <Avatar
                {...stringAvatar(`${props.member?.firstName?.toUpperCase()} ${props.member?.lastName?.toUpperCase()}`)}
                alt={`${props.member?.firstName} ${props.member?.lastName}`}
                sx={{
                  bgcolor: theme.palette.mode === "light" ? "#E9ECFF" : undefined,
                  fontSize: `0.9em`,
                  fontWeight: 500,
                  color: theme.palette.mode === "light" ? indigo[500] : indigo[100],
                }}
              />
            </Badge>
          </Grid>
          <Grid item xs={9}>
            <Typography>
              {props.member?.firstName ? (
                `${props.member?.firstName} ${props.member?.lastName}`
              ) : (
                <Skeleton variant="text" sx={{ width: "100%", height: 25 }} />
              )}
            </Typography>
          </Grid>
        </Grid>
        <Stack direction="row" sx={{ mx: 1, flex: 1, minHeight: "50px" }}>
          <Typography color={indigo[600]}>NOW:&nbsp;</Typography>
          <Typography sx={{ width: "100%" }}>
            {props.member?.firstName ? currentStatus : <Skeleton variant="text" sx={{ width: "100%", height: 25 }} />}
          </Typography>
        </Stack>
        <Stack direction="column" gap={1}>
          <Button
            variant="outlined"
            onClick={() => {
              socket_activateInactivityPromptForUser(
                props.member.userId,
                `${props.member.firstName} ${props.member.lastName}`
              );
              setSentMessage(true);

              setTimeout(() => {
                setSentMessage(false);
              }, 2000);
            }}
          >
            {messageSent ? "DONE" : "ALERT"}
          </Button>
          <Button
            onClick={() => {
              navigate("/chat");
            }}
          >
            MESSAGE
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default EmployeeCard;
