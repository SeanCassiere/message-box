import React, { useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import PageBlockItem from "../../../../shared/components/Layout/PageBlockItem";
import BasicDetailsBlock from "../../../../shared/components/Account/BasicDetailsBlock";
import BasicTeamsDetails from "../../../../shared/components/Account/BasicTeamsDetails";
import BasicRolesDetails from "../../../../shared/components/Account/BasicRolesDetails";

import { selectUserState, selectLookupListsState } from "../../../../shared/redux/store";
import { IRoleProfile, ITeamProfile } from "../../../../shared/interfaces/Client.interfaces";
import { refreshUserProfileThunk } from "../../../../shared/redux/slices/user/thunks";

const AccountProfile = () => {
  const dispatch = useDispatch();

  const { userProfile } = useSelector(selectUserState);
  const { rolesList, teamsList } = useSelector(selectLookupListsState);

  useEffect(() => {
    dispatch(refreshUserProfileThunk());
  }, [dispatch]);

  const availableUserRoles = useMemo(() => {
    const rolesToReturn: IRoleProfile[] = [];
    if (userProfile) {
      userProfile.roles.forEach((roleId) => {
        const roleToAdd = rolesList.find((r) => r.roleId === roleId);
        if (roleToAdd) {
          rolesToReturn.push(roleToAdd);
        }
      });
    }

    return rolesToReturn;
  }, [rolesList, userProfile]);

  const availableUserTeams = useMemo(() => {
    const teamsToReturn: ITeamProfile[] = [];
    if (userProfile) {
      userProfile.teams.forEach((teamId) => {
        const teamToAdd = teamsList.find((r) => r.teamId === teamId);
        if (teamToAdd) {
          teamsToReturn.push(teamToAdd);
        }
      });
    }

    return teamsToReturn;
  }, [teamsList, userProfile]);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
        <Box>
          <Typography variant="h5">My Account</Typography>
        </Box>
        <Box sx={{ display: "inline-flex", columnGap: "1rem" }}>
          <IconButton color="secondary" aria-label="refresh">
            <RefreshOutlinedIcon />
          </IconButton>
          <Button startIcon={<EditOutlinedIcon />}>Edit</Button>
        </Box>
      </Box>
      <PageBlockItem>
        <BasicDetailsBlock userDetails={userProfile} />
      </PageBlockItem>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <PageBlockItem>
            <BasicTeamsDetails userTeams={availableUserTeams} />
          </PageBlockItem>
        </Grid>
        <Grid item xs={12} md={4}>
          <PageBlockItem>
            <BasicRolesDetails userRoles={availableUserRoles} />
          </PageBlockItem>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccountProfile;
