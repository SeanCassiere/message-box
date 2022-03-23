import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import BusinessIcon from "@mui/icons-material/Business";

import PagePaperWrapper from "../../shared/components/Layout/PagePaperWrapper";
import ActivityBlock from "../../shared/components/TeamActivity/ActivityBlock";
import ViewCompanyDialog from "./ViewCompanyDialog";

import { selectLookupListsState, selectUserState } from "../../shared/redux/store";
import { usePermission } from "../../shared/hooks/usePermission";
import { getClientTeamsLookupListThunk } from "../../shared/redux/slices/lookup/thunks";

const TeamActivityLayout = () => {
  const dispatch = useDispatch();
  const { teamsList } = useSelector(selectLookupListsState);
  const { userProfile } = useSelector(selectUserState);
  const hasTeamActivityAdmin = usePermission("team-activity:admin");

  const [showCompanyDialog, setShowCompanyDialog] = React.useState(false);
  const [showAllTeams, setShowAllTeams] = React.useState(false);

  const handleCloseCompanyDialog = React.useCallback(() => {
    setShowCompanyDialog(false);
  }, []);

  const activityBlocksToShow = React.useMemo(() => {
    const teams = [];
    const companyTeam = teamsList.find((t) => t.rootName === "company");
    if (showAllTeams) {
      for (const t of teamsList) {
        if (t.teamId === companyTeam?.teamId) continue;
        teams.push(t);
      }
    } else {
      if (userProfile) {
        for (const teamId of userProfile?.teams) {
          const team = teamsList.find((t) => t.teamId === teamId);
          if (team && team.teamId !== companyTeam?.teamId) {
            teams.push(team);
          }
        }
      }
    }

    return teams;
  }, [showAllTeams, teamsList, userProfile]);

  const companyTeam = React.useMemo(() => teamsList.find((t) => t.rootName === "company"), [teamsList]);

  React.useEffect(() => {
    dispatch(getClientTeamsLookupListThunk());
  }, [dispatch, showAllTeams]);

  return (
    <>
      <ViewCompanyDialog showDialog={showCompanyDialog} onClose={handleCloseCompanyDialog}>
        {companyTeam && <ActivityBlock teamName="Company" overviewTeamData={companyTeam} initiallyShowFull />}
      </ViewCompanyDialog>
      <PagePaperWrapper>
        <Grid container>
          <Grid item xs={12} md={5}>
            <Typography variant="h4" fontWeight={500} component="h1">
              Team Activity
            </Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <Stack
              flexDirection={{ sm: "column", md: "row" }}
              alignItems={{ sm: "start", md: "center" }}
              justifyContent="end"
              sx={{ mt: { sm: 2, md: 0 } }}
            >
              {hasTeamActivityAdmin && (
                <FormGroup sx={{ mr: 1 }}>
                  <FormControlLabel
                    control={<Switch checked={showAllTeams} onChange={(_, c) => setShowAllTeams(c)} />}
                    label="Show all teams"
                  />
                </FormGroup>
              )}
              <Button startIcon={<BusinessIcon />} disableElevation={false} onClick={() => setShowCompanyDialog(true)}>
                View company
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <Stack direction="column" gap={2} sx={{ mt: 3 }}>
          {activityBlocksToShow.map((team) => (
            <ActivityBlock
              key={`activity-block-${team.teamId}`}
              teamName={team.teamName}
              overviewTeamData={team}
              showTitle
              showBorder
              liftShadow
            />
          ))}
        </Stack>
      </PagePaperWrapper>
    </>
  );
};

export default TeamActivityLayout;
