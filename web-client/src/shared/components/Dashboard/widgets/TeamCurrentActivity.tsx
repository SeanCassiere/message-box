import React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { red } from "@mui/material/colors";

import { IParsedWidgetOnDashboard } from "../../../interfaces/Dashboard.interfaces";
import { ITeamMember, ITeamProfile } from "../../../interfaces/Client.interfaces";
import { client } from "../../../api/client";
import { useSelector } from "react-redux";
import { selectLookupListsState, selectUserState } from "../../../redux/store";

interface IProps {
  widget: IParsedWidgetOnDashboard;
}

const TeamCurrentActivity = (props: IProps) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<ITeamProfile | null>(null);

  React.useEffect(() => {
    const abort = new AbortController();

    let teamId = "";

    const findTeamId = props.widget.config.find((w) => w.parameter === "teamId");
    if (findTeamId) {
      teamId = findTeamId.value;
    }

    client
      .get(`/Teams/${teamId}`, { signal: abort.signal })
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
        }
      })
      .catch((err) => {
        if (err?.message !== "canceled") {
          console.log(err);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      abort.abort();
    };
  }, [props.widget.config]);

  const breakColMode = React.useMemo(() => {
    let value = false;

    const sixColumnOpts = [12, 11, 10, 9, 8, 7, 6];

    if (sixColumnOpts.includes(props.widget.widgetScale)) {
      value = true;
    }
    return value;
  }, [props.widget.widgetScale]);

  const cardWidth = React.useMemo(() => {
    let finalWidth = 12;

    if (breakColMode) {
      finalWidth = 6;
    }

    return finalWidth;
  }, [breakColMode]);

  if (loading) {
    return (
      <Box>
        <Typography>Loading</Typography>
      </Box>
    );
  }

  if (loading === false && data === null) {
    return (
      <Box>
        <Typography>Team not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ my: 1, mx: 0, px: 0, width: "100%", height: "95%" }}>
      <Grid container gap={0}>
        {data?.members.map((user) => (
          <Grid
            key={`${props.widget.id}-${data.teamId}-${user.userId}`}
            item
            xs={12}
            sm={cardWidth}
            md={cardWidth}
            sx={{
              borderColor: "secondary.50",
              borderStyle: "solid",
              borderWidth: 1,
              borderRadius: 2,
            }}
          >
            <Box
              sx={
                {
                  // pl: breakColMode ? 1 : 0,
                }
              }
            >
              <TeamMemberBlock user={user} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const TeamMemberBlock = (props: { user: ITeamMember }) => {
  const { onlineUsersList } = useSelector(selectLookupListsState);
  const { statusList } = useSelector(selectUserState);

  const onlineMember = onlineUsersList.find((user) => user.userId === props.user.userId);

  const currentStatus = onlineMember ? onlineMember.status : "Offline";
  const badgeColor = React.useMemo(() => {
    const findStatus = statusList.find((status) => status.status === currentStatus);

    if (!findStatus) return red[300];

    return findStatus.color;
  }, [currentStatus, statusList]);

  return (
    <Stack
      sx={{
        width: "99%",
        px: 2,
        py: 1,
      }}
      flexDirection="row"
      gap={2}
      alignItems="center"
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ bgcolor: badgeColor, width: 10, height: 10, aspectRatio: "1/1", borderRadius: "100%" }}></Box>
      </Box>
      <Typography>
        {props.user.firstName} {props.user.lastName} - {currentStatus}
      </Typography>
    </Stack>
  );
};

export default TeamCurrentActivity;
