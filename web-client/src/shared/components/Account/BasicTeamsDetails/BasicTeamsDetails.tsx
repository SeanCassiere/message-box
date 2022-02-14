import React from "react";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { ITeamProfile } from "../../../interfaces/Client.interfaces";

interface Props {
  userTeams: ITeamProfile[];
}

const BasicTeamsDetails = (props: Props) => {
  const { userTeams } = props;
  return (
    <Grid container>
      <Grid item xs={12} md={12}>
        <Typography fontSize={20} fontWeight={400}>
          My Teams
        </Typography>
      </Grid>
      <Grid item xs={12} md={12} sx={{ marginTop: 1 }}>
        <Grid container>
          {userTeams.map((team) => (
            <Grid item xs={12} md={12} key={team.teamId}>
              <BoxStyled>{team.teamName}</BoxStyled>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

const BoxStyled = styled(Box)(({ theme }) => ({
  backgroundColor: "#f0fdfa",
  padding: "1rem 1rem",
  borderRadius: 6,
  borderColor: theme.palette.primary["main"],
  borderWidth: 2,
  borderStyle: "solid",
  marginBottom: "0.5rem",
}));

export default BasicTeamsDetails;
