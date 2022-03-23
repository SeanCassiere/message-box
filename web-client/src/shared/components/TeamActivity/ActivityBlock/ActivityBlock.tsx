import React from "react";
import { useSelector } from "react-redux";

import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";

import EmployeeCard from "../EmployeeCard";

import { COMMON_ITEM_BORDER_STYLING } from "../../../util/constants";
import { ITeamMember, ITeamProfile } from "../../../interfaces/Client.interfaces";
import { client } from "../../../api/client";
import { selectLookupListsState } from "../../../redux/store";
import { dummyPromise } from "../../../util/testingUtils";

const MD_GRID_COL_SPAN = 2;
const LG_GRID_COL_SPAN = 2;

const MAX_SINGLE_LINE = 6;

interface IProps {
  teamName: string;
  overviewTeamData: ITeamProfile;
  initiallyShowFull?: true;
  showTitle?: true;
  showBorder?: true;
  liftShadow?: true;
}

const ActivityBlock = (props: IProps) => {
  const { overviewTeamData, initiallyShowFull } = props;
  const { onlineUsersList } = useSelector(selectLookupListsState);
  const [showMore, setShowMore] = React.useState(initiallyShowFull ?? false);
  const [hideView, setHideView] = React.useState(false);

  const [fetchedTeamData, setFetchedTeamData] = React.useState<ITeamProfile>(overviewTeamData);

  React.useEffect(() => {
    client(`/Teams/${overviewTeamData.teamId}`)
      .then((res) => {
        if (res.status === 200) {
          // sort the online users to be shown first
          const onlineUserIds = onlineUsersList.map((u) => u.userId);
          const onlineFirst = res.data.members.filter((m: ITeamMember) => onlineUserIds.includes(m.userId));
          const offlineFirst = res.data.members.filter((m: ITeamMember) => !onlineUserIds.includes(m.userId));

          dummyPromise(750).then(() => {
            setFetchedTeamData({ ...res.data, members: [...onlineFirst, ...offlineFirst] });
            setHideView(false);
          });
        } else {
          setHideView(true);
        }
      })
      .catch((err) => {
        console.log(`Error fetching team data for teamId: ${overviewTeamData.teamId}`, err);
        setHideView(true);
      })
      .finally(() => {});
  }, [onlineUsersList, overviewTeamData.teamId]);

  if (hideView) {
    return <>{null}</>;
  }

  return (
    <Paper
      sx={{
        py: 2,
        px: 2,
        border: props.showBorder ? COMMON_ITEM_BORDER_STYLING : null,
        borderRadius: 1,
        boxShadow: props.liftShadow ? "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" : null,
        "&::-webkit-scrollbar": {
          width: "12px",
        },
        "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
          border: `3.5px solid rgba(0, 0, 0, 0)`,
          backgroundClip: `padding-box`,
          borderRadius: "9999px",
        },
        position: "relative",
      }}
      elevation={props.liftShadow ? 1 : 0}
    >
      <Stack direction="column" gap={2}>
        <Grid container>
          <Grid item xs={12} md={7}>
            <Typography variant="h6" fontWeight={500} component="h4">
              {props.showTitle && String(props.teamName)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack alignItems="end">
              {fetchedTeamData.members.length > MAX_SINGLE_LINE && (
                <Button disableElevation={false} onClick={() => setShowMore((p) => !p)} color="secondary">
                  Show full team
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
        <Grid container rowGap={1}>
          {fetchedTeamData.members.slice(0, MAX_SINGLE_LINE).map((member) => (
            <Grid
              key={`team-activity-${props.teamName.replace(" ", "-")}-${member.userId}`}
              xs={12}
              md={MD_GRID_COL_SPAN}
              lg={LG_GRID_COL_SPAN}
              item
            >
              <EmployeeCard member={member} />
            </Grid>
          ))}
        </Grid>
        <Collapse in={showMore}>
          <Grid container rowGap={1}>
            {fetchedTeamData.members.length > MAX_SINGLE_LINE && (
              <>
                {fetchedTeamData.members.slice(MAX_SINGLE_LINE).map((member) => (
                  <Grid
                    key={`team-name-${props.teamName.replace(" ", "-")}-${member.userId}`}
                    xs={12}
                    md={MD_GRID_COL_SPAN}
                    lg={LG_GRID_COL_SPAN}
                    item
                    sx={{ mb: 2 }}
                  >
                    <EmployeeCard member={member} />
                  </Grid>
                ))}
              </>
            )}
          </Grid>
        </Collapse>
      </Stack>
    </Paper>
  );
};

export default ActivityBlock;
